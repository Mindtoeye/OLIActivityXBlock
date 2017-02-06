"""
An XBlock providing a place to store and embed OLI activities.
"""

import re
import uuid
import math
import json
import pkg_resources
import requests
import bleach
import urllib
import time
import logging
import xml.etree.ElementTree as XMLParser

# pylint: disable=import-error
# The xBlock package are availabe in the runtime environment.
from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Float, Boolean
from xblock.fragment import Fragment
# pylint: enable=import-error

"""
An XBlock providing a place to store and embed OLI activities.
"""
class OLIActivityXBlock(XBlock):
    # pylint: disable=too-many-instance-attributes
    # All of the instance variables are required.

    useDebugging=True

    display_name = String(help="Display name of the XBlock", default="OLI Embedded Activity", scope=Scope.content)

    # **** xBlock tag variables ****
    width = Integer(help="Width of the tutor frame.", default=690, scope=Scope.content)
    height = Integer(help="Height of the tutor frame.", default=550, scope=Scope.content)

    # **** Grading variables ****
    # Required accordign to EdX's documentation in order to get grading to work
    has_score = Boolean(default=True, scope=Scope.content)
    icon_class = String(default="problem", scope=Scope.content)
    score = Integer(help="Current count of correctly completed student steps", scope=Scope.user_state, default=0)
    max_problem_steps = Integer(
        help="Total number of steps",
        scope=Scope.user_state, default=1)
    max_possible_score = 1  # should this be 1.0?

    dataActivitymode=String(default="unassigned", scope=Scope.user_state)
    dataActivityguid=String(default="unassigned", scope=Scope.user_state)
    dataUserguid=String(default="unassigned", scope=Scope.user_state)
    dataAuthenticationtoken=String(default="unassigned", scope=Scope.user_state)
    dataResourcetypeid=String(default="unassigned", scope=Scope.user_state)
    dataSessionid=String(default="unassigned", scope=Scope.user_state)
    dataSuperactivityserver=String(default="unassigned", scope=Scope.user_state)

    attempted = Boolean (help="True if at least one step has been completed", scope=Scope.user_state, default=False)
    completed = Boolean (help="True if all of the required steps are correctly completed", scope=Scope.user_state, default=False)
    # weight needs to be set to something, errors will be thrown if it does
    weight = Float(display_name="Problem Weight", help=("Defines the number of points each problem is worth. If the value is not set, the problem is worth the sum of the option point values."), values={"min": 0, "step": .1}, scope=Scope.settings)

    # **** Configuration variables ****
    logging = Boolean(help="If tutor log data should be transmitted to EdX.", default="True", scope=Scope.settings)

    # **** User Information ****
    saveandrestore = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_state)
    skillstring = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_info)

    embedhtml = "public/embed.html"
    activityxml = String (help="The relative path in content to the OLI XML that defines the activity",default="public/webcontent/x-oli-embed-activity/test02k_adobe_captivate_activity.xml",scope=Scope.user_info)
    workbookxml = String (help="The relative path in content to the OLI XML that defines the workbook page (if any)",default="public/webcontent/x-oli-workbook_page/test02k_adobe_captivate_activity_workbook.xml",scope=Scope.user_info)

    activityTitle = 'Test 02b, Embedded Activities - (API Test)'
    activityClass = 'test02b_embeddedapi_class'

    # **** Utility functions and methods ****

    def olidebug (self,aMessage):
       if (self.useDebugging == True):
          log = logging.getLogger(__name__)
          log.info (aMessage)

    @staticmethod
    def student_id(self):
        #return self.xmodule_runtime.anonymous_student_id
        return self.runtime.anonymous_student_id

    def max_score(self):
        """ The maximum raw score of the problem. """
        # For some unknown reason, errors are thrown if the return value is
        # hard coded.
        return self.max_possible_score

    @staticmethod
    def resource_string(path):
        """ Read in the contents of a resource file. """
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    @staticmethod
    def strip_local(url):
        """ Returns the given url with //localhost:port removed. """
        return re.sub(r'//localhost(:\d*)?', '', url)

    def get_local_resource_url(self, url):
        self.olidebug ('get_local_resource_url ('+url+')')
        """ Wrapper for self.runtime.local_resource_url. """
        # It has been observed that self.runtime.local_resource_url(self, url)
        # prepends "//localhost:(port)" which makes accessing the Xblock in EdX
        # from a remote machine fail completely.
        return self.strip_local(self.runtime.local_resource_url(self, url))

    def loadActivityXML(self,xmlPath):
        self.olidebug ('loadActivityXML ('+xmlPath+')')
        data = self.resource_string(xmlPath)
        self.olidebug ('Data loaded: ' + data)
        self.olidebug ('Parsing ...')
        activityTree=XMLParser.fromstring (data)
        self.olidebug ('Done, returning root ...')
        return activityTree

    def loadActivityXMLAsString(self,xmlPath):
        self.olidebug ('loadActivityXMLAsString ('+xmlPath+')')
        data = self.resource_string(xmlPath)
        self.olidebug ('Data loaded, returning: ' + data)
        return data		

    def processClassXML (self,root):
        self.olidebug ('processClassXML ()')
        for child in root:
            print ('Tag: ' + child.tag)

    # **** xBlock methods ****
    def student_view (self, dummy_context=None):
        self.olidebug ('student_view ()')
        activityRoot=self.loadActivityXML (self.activityxml)
        self.dataActivitymode = "student"
        self.dataActivityguid = 'S-'+str(uuid.uuid4())
        self.dataUserguid = self.student_id(self)
        self.dataAuthenticationtoken = 'S-'+str(uuid.uuid4())
        self.dataResourcetypeid = 'S-'+str(uuid.uuid4())
        self.dataSessionid = 'S-'+str(uuid.uuid4())
        self.dataSuperactivityserver = "local"
        # pylint: enable=broad-except
        # read in template html
        html = self.resource_string("static/html/olixblock.html")
        # fill in the template html
        frag = Fragment(html.format (activity_html=(
                                                    self.get_local_resource_url(self.embedhtml)),
                                                    width=self.width,
                                                    height=self.height,
                                                    dataActivitymode=self.dataActivitymode,
                                                    dataActivityguid=self.dataActivityguid,
                                                    dataUserguid=self.dataUserguid,
                                                    dataAuthenticationtoken=self.dataAuthenticationtoken,
                                                    dataResourcetypeid=self.dataResourcetypeid,
                                                    dataSessionid=self.dataSessionid,
                                                    dataSuperactivityserver=self.dataSuperactivityserver))
        # Add javascript initialization code
        frag.add_javascript(self.resource_string("static/js/olixblock.js"))
        # Execute javascript initialization code
        frag.initialize_js('OLIXBlock')
        return frag

    @XBlock.json_handler
    def loadClientConfig (self, data, dummy_suffix=''):
        self.olidebug ('loadClientConfig ()')
        localBase=self.get_local_resource_url ('public')
        self.olidebug ('Using local path: ' + localBase)
        xmlResponse= '<?xml version="1.0" encoding="UTF-8"?>'
        xmlResponse+='<super_activity_client server_time_zone="America/New_York">'
        xmlResponse+='<resource_type id="x-oli-embed-activity" name="Embed activity" />'
        xmlResponse+='<base href="'+localBase+'" />'
        xmlResponse+='<authentication user_guid="'+self.dataUserguid+'" />'
        xmlResponse+='<logging session_id="'+self.dataSessionid+'" source_id="Embed">'
        xmlResponse+='    <url>https://dev-02.oli.cmu.edu/jcourse/dashboard/log/server</url>'
        xmlResponse+='</logging>'
        xmlResponse+='</super_activity_client>'
        return ({'data' : xmlResponse})

    @XBlock.json_handler
    def beginSession (self, data, dummy_suffix=''):
        self.olidebug ('beginSession ()')
        ts = str(time.time())
        activityRoot = self.loadActivityXML (self.activityxml)
        activityXML = self.get_local_resource_url (self.activityxml)
        self.processClassXML (activityRoot)
        localBase=self.get_local_resource_url ('public')
        self.olidebug ('Using local path: ' + localBase)
        xmlResponse= '<?xml version="1.0" encoding="UTF-8"?>'
        xmlResponse+='<super_activity_session>'
        xmlResponse+='<metadata>'
        xmlResponse+='  <user anonymous="false" country="US" date_created="'+ts+'" email="staff@example.com" first_name="Martin" guid="'+self.dataUserguid+'" institution="Carnegie Mellon University" last_name="van Velsen" />'
        xmlResponse+='  <authorizations grade_responses="true" instruct_material="true" view_material="true" view_responses="true" />'
        xmlResponse+='  <section admit_code="QA101" auto_validate="true" date_created="1477407995000" duration="Oct 2016 - Oct 2026" end_date="1792900800000" guest_section="false" guid="fc60f4e40a2d9bec17f7f6e6bcaea730" institution="CMU OLI" registration_closed="false" start_date="1477368000000" time_zone="America/New_York" title="'+self.activityTitle+'">'
        xmlResponse+='    <instructors>'
        xmlResponse+='      <user anonymous="false" country="US" date_created="'+ts+'" email="staff@example.com" first_name="Martin" guid="'+self.dataUserguid+'" institution="Carnegie Mellon University" last_name="van Velsen" />'
        xmlResponse+='    </instructors>'
        xmlResponse+='  </section>'
        xmlResponse+='  <registration date_created="1477407995000" guid="fc60f4f40a2d9bec554c93ffd3a37668" role="instructor" section_guid="fc60f4e40a2d9bec17f7f6e6bcaea730" status="valid" user_guid="'+self.dataUserguid+'" />'
        xmlResponse+='  <activity guid="d68e11560a2d9bec2796a69db6244535" high_stakes="false" just_in_time="false" section_guid="fc60f4e40a2d9bec17f7f6e6bcaea730">'
        xmlResponse+='     <item_info guid="d68e0eb80a2d9bec0ca250acd7a5ccf6" id="i_test02b_embeddedapi_class_038" organization_guid="d68e0e080a2d9bec60d1636e7e8c2ecd" purpose="learnbydoing" scoring_mode="default">'
        xmlResponse+='       <resource_info guid="'+self.dataActivityguid+'" id="'+self.activityClass+'" title="'+self.activityTitle+'" type="x-oli-embed-activity">'
        xmlResponse+='         <file guid="d68e07a60a2d9bec5b9976f45af29208" href="'+activityXML+'" mime_type="text/xml" />'
        xmlResponse+='         <resource_files />'
        xmlResponse+='       </resource_info>'
        xmlResponse+='     </item_info>'
        xmlResponse+='  </activity>'
        xmlResponse+='  <web_content href="'+localBase+'/" />'
        xmlResponse+='</metadata>'
        xmlResponse+='<storage>'
        xmlResponse+='  <file_directory />'
        xmlResponse+='</storage>'
        xmlResponse+='<grading>'
        xmlResponse+='  <attempt_history activity_guid="d68e11560a2d9bec2796a69db6244535" current_attempt="1" date_started="'+ts+'" first_accessed="'+ts+'" last_accessed="'+ts+'" last_modified="'+ts+'" max_attempts="-1" overall_attempt="1" user_guid="'+self.dataUserguid+'">'
        xmlResponse+='    <problem date_created="'+ts+'" max_attempts="-1" resource_guid="'+self.dataActivityguid+'" resource_type_id="x-oli-embed-activity">'
        xmlResponse+='       <grading_attributes />'
        xmlResponse+='       <launch_attributes>'
        xmlResponse+='          <attribute attribute_id="width" value="690" />'
        xmlResponse+='          <attribute attribute_id="height" value="550" />'
        xmlResponse+='       </launch_attributes>'
        xmlResponse+='    </problem>'
        xmlResponse+='    <activity_attempt date_accessed="'+ts+'" date_modified="'+ts+'" date_started="'+ts+'" number="1" />'
        xmlResponse+='  </attempt_history>'
        xmlResponse+='</grading>'
        xmlResponse+='</super_activity_session>'
        return ({'data' : xmlResponse})

    @XBlock.json_handler
    def loadContentFile (self, data, dummy_suffix=''):
        self.olidebug ('loadContentFile ()')
        activityXML = self.loadActivityXMLAsString (self.activityxml)
        return ({'data' : activityXML})

    @XBlock.json_handler
    def oli_log(self, data, dummy_suffix=''):
        self.olidebug ('oli_log ()')
        """Publish log messages from an OLI embedded activity directly to the EdX log."""
        if data.get('event_type') is None or\
           data.get('action') is None or\
           data.get('message') is None:
            return {'result': 'fail',
                    'error': 'Log request message is missing required fields.'}
        # pylint: disable=broad-except
        try:
            data.pop('event_type')
            logdata = data  # assume that data is already been checked.
            logdata['user_id'] = self.runtime.user_id
            logdata['component_id'] = unicode(self.scope_ids.usage_id)
            self.runtime.publish(self, "olilog", logdata)
        except KeyError as keyerr:
            return {'result': 'fail', 'error': unicode(keyerr)}
        # General mechanism to catch a very broad category of errors.
        except Exception as err:
            return {'result': 'fail', 'error': unicode(err)}
        # pylint: enable=broad-except
        return {'result': 'success'}

    def studio_view(self, dummy_context=None):
        self.olidebug ('studio_view ()')
        """" Generate what is seen in the Studio view Edit dialogue. """
        # read in template
        html = self.resource_string("static/html/olistudio.html")
        # Make fragment and fill out template
        frag = Fragment(html.format(
            activityxml=self.activityxml,
            workbookxml=self.workbookxml,
            width=self.width,
            height=self.height,
            logging='checked' if self.logging else ''))
        # read in, add, and execute javascript
        studio_js = self.resource_string("static/js/olistudio.js")
        frag.add_javascript(unicode(studio_js))
        frag.initialize_js('OLIXBlockStudio')
        return frag

    @staticmethod
    def validate_xml_location(url):
        """ Validate that the passed url is a CTAT tutor interface. """
        if url is None:
            raise Exception('No html interface file specified.')
        return url

    @staticmethod
    def validate_number(num, default):
        """ Validate that the passed string is a number. """
        if num is None:
            return default
        return int(num)

    @staticmethod
    def validate_logging(enable_logging):
        """Validate that the string is a proper value for enabling logging."""
        logging = False
        if enable_logging is not None:
            logging = bleach.clean(enable_logging, strip=True)
            if logging.lower() == "true":
                logging = True
        return logging

    @XBlock.json_handler
    def studio_submit(self, data, dummy_suffix=''):
        self.olidebug ('studio_submit ()')
        """
        Called when submitting the form in Studio.
        This will only modify values if all of the safty checks pass.

        Args:
          self: the CTAT XBlock.
          data: a JSON object encoding the form data from
                static/html/ctatstudio.html
          dummy_suffix: unused but required as a XBlock.json_handler.
        Returns:
          A JSON object reporting the success of the operation.
        """
        # pylint: disable=broad-except
        # This uses the generic exceptions so that we do not have to
        # generate custom error classes and this handles the classes
        # of exceptions potentially raised by requests
        try:
            valid_activityxml = self.validate_xml_location(data.get('activityxml'))
            valid_workbookxml = self.validate_xml_location(data.get('workbookxml'))
            valid_width = self.validate_number(data.get('width'), self.width)
            valid_height = self.validate_number(data.get('height'),
                                                self.height)
            valid_logging = self.validate_logging(data.get('logging'))
        except Exception as err:
            return {'result': 'fail', 'error': unicode(err)}
        # pylint: enable=broad-except
        # Only update values if all checks pass
        self.activityxml = valid_activityxml
        self.workbookxml = valid_workbookxml
        self.width = valid_width
        self.height = valid_height
        self.logging = valid_logging
        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        self.olidebug ('workbench_scenarios ()')
        """ Prescribed XBlock method for displaying this in the workbench. """
        return [
            ("OLIActivityXBlock",
             """<vertical_demo>
                <olixblock width="690" height="550"/>
                </vertical_demo>
             """),
        ]
