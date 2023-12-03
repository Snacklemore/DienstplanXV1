import hashlib
import os, os.path
import cherrypy
#import CherrypyMako
from mako.template import Template
from mako.lookup import TemplateLookup
import psycopg2
import datetime
import calendar
from ws4py.messaging import TextMessage
from datetime import datetime,date,time,timezone
import bcrypt
import glob
import json
import shutil

#CherrypyMako.setup()
#(root(01)/public | root(01)/templates)
root_dir = os.path.abspath( os.getcwd())
SESSION_KEY = '_cp_username'

#implemented https://github.com/cherrypy/tools/blob/master/AuthenticationAndAccessRestrictions
########################################################################################################
########################################################################################################



def check_auth(*args,**kwargs):
    """A tool that looks in config for 'auth.require'. If found and it
    is not None, a login is required and the entry is evaluated as a list of
    conditions that the user must fulfill"""
    conditions = cherrypy.request.config.get('auth.require', None)
    if conditions is not None:
        username = cherrypy.session.get(SESSION_KEY)
        if username:
            cherrypy.request.login = username
            for condition in conditions:
                # A condition is just a callable that returns true or false
                if not condition():
                    raise cherrypy.HTTPRedirect("/passphrase")
                else: 
                    raise cherrypy.HTTPRedirect("/content")
        else:
            raise cherrypy.HTTPRedirect("/passphrase")
    
cherrypy.tools.auth = cherrypy.Tool('before_handler', check_auth)
def is_logged_in(*args,**kwargs):
    return

def require(*conditions):
    """A decorator that appends conditions to the auth.require config
    variable."""
    def decorate(f):
        if not hasattr(f, '_cp_config'):
            f._cp_config = dict()
        if 'auth.require' not in f._cp_config:
            f._cp_config['auth.require'] = []
        f._cp_config['auth.require'].extend(conditions)
        return f
    return decorate




# Conditions are callables that return True
# if the user fulfills the conditions they define, False otherwise
#
# They can access the current username as cherrypy.request.login
#
# Define those at will however suits the application.

def member_of(groupname):
    def check():
        # replace with actual check if <username> is in <groupname>
        return cherrypy.request.login == 'joe' and groupname == 'admin'
    return check

def name_is(reqd_username):
    return lambda: reqd_username == cherrypy.request.login
    
########################################################################################################  
########################################################################################################        

def write_json_to_file(file_path,data):
    try:
        with open(file_path, 'w') as json_file:
            json.dump(data,json_file,indent=4)
        print(f"JSON data written to '{file_path}'")
    except Exception as e:
        print(f"Error writing JSON to '{file_path}' : {e}")


def read_json_from_file(file_path):
    try:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
        print(f"JSON data read from '{file_path}' successfully.")
        return data
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from '{file_path}': {e}")
        return None
    
def get_days_in_month(year,month):
    try:
        _,num_days = calendar.monthrange(year,month)
        days = [calendar.day_name[calendar.weekday(year,month,day)]for day in range(1,num_days +1)]
        return days
    except ValueError as e:
        print(f"Error {e}")
        return None

from db import adminAuth
#Register API
@cherrypy.expose
class appDatabaseRegister(object):
    @cherrypy.tools.accept(media='text/plain')
    def GET(self):
        pass

    def POST(self,passphrase):
       cherrypy.log(passphrase)
       
       if (passphrase == "123"):
        cherrypy.log("true")
        cookie = cherrypy.response.cookie
        cherrypy.session[SESSION_KEY] = cherrypy.request.login = "user"
        return "success"
       if ( passphrase == adminAuth):
        cherrypy.log("true")
        cookie = cherrypy.response.cookie
        cherrypy.session[SESSION_KEY] = cherrypy.request.login = "admin"
        return "admin"
       else:
        return "-1"
    def PUT(self):
        return
    def DELETE(self,id):
        print("delete triggerd")
        return
    
#Login API
@cherrypy.expose
class appDatabaseLogin(object):
    @cherrypy.tools.accept(media='text/plain')
    @require()
    def GET(self):
        pass

    def POST(self,username,password):
       pass
    def PUT(self):
        return
    def DELETE(self):
        return
    
    

@cherrypy.expose
class appEndPointTableSave(object):

    


    @cherrypy.tools.accept(media='text/plain')
    @require()
    def GET(self,type,id):
       pass
       
    
    
    #more parameters for endpoint(month,year)
    @cherrypy.tools.accept(media='text/plain')
    @require()
    def POST(self,tableData,month,year):
        if (cherrypy.request.login == "admin"):
            print("Saved!")
            print(tableData)
            print(month)
            print(year)
            #construct file, consisting of month and year 
            filename = "data"+month+year +".json"

            if os.path.exists(filename):
                os.remove(filename)
                with open(filename,'w'):pass
            write_json_to_file(filename,tableData)
            pass
       
        else:
            return  "NOT AUTHORIZED".encode('utf-8')
    def PUT(self):
        return
    @require()
    def DELETE(self,id):
        
        return
    
@cherrypy.expose
class appEndPointTableGet(object):

    


    @cherrypy.tools.accept(media='text/plain')
    @require()
    #more parameter for endpoint ( year, month)
    def GET(self,days,currentMonth,currentYear):
        #currentMonth.strip("0")
        filename = "data"+currentMonth+currentYear +".json"
        if (int(days) == 0):
            if not os.path.exists(filename):
                #file doesnt exist
                # no file --> no data
                f = open(filename,'w')
                
                data = "error"
                return data
            try:
                data = read_json_from_file(filename)
            except ValueError as e:
                return "error"
            
            return data
        else:
            
            days_in_month = get_days_in_month(int(currentYear),int(currentMonth))
            if days_in_month is not None:
                print(f"Days in in Month")
                for day in days_in_month:
                    print(day)
            return json.dumps(days_in_month)
    
    
    
    
    @require()
    def POST(self,ufile):
        
        pass
       
        
    def PUT(self):
        return
    @require()
    def DELETE(self,id):
        
        return

localDirec = os.path.abspath(os.path.dirname(__file__))
lookup = TemplateLookup(directories=['E:\\DienstplanXV1\\CherrypyServer\\templates'])
#lookup = TemplateLookup(directories=['/templates'])
class Root(object):
    @cherrypy.expose
    @require()
    def index(self):
        user = cherrypy.request.login
        print(user)
        raise cherrypy.HTTPRedirect("/content")
        
       
    #Require a passphrase, if correct cookie gets authorized
    @cherrypy.expose
    def passphrase(self):
        
        print(lookup.directories)
        template = lookup.get_template('index.mako')


        return template.render()
        
    

    #content delivery from here (eg. the pdf)
    @cherrypy.expose
    @require()
    def content(self):

        template = lookup.get_template('content.mako')
        return template.render()

           

    
        
#move file helper
def move_file(source_path, destination_path):
    try:
        # Check if the source file exists
        if not os.path.exists(source_path):
            print(f"Error: Source file '{source_path}' does not exist.")
            return

        # Check if the destination folder exists, create it if not
        destination_folder = os.path.dirname(destination_path)
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)

        # Copy the file
        shutil.copy(source_path, destination_path)
        print(f"File '{source_path}' copied to '{destination_path}' successfully.")

        # Delete the source file
        os.remove(source_path)
        print(f"Source file '{source_path}' deleted.")

    except Exception as e:
        print(f"Error: {e}")

    



# lookup = TemplateLookup(directories=['/home/utubedl/utubedlCherryPy/cookbookv2/cookbookapp/CherrypyServer/templates'])


        
if __name__ == '__main__':
    
    
   
    

    
    
    
    
    localDir = os.path.abspath(os.path.dirname(__file__))
    print(localDir)
    CA = os.path.join(localDir,'fullchain.pem')
    KEY= os.path.join(localDir,'privkey.pem')

   
    _cp_config={
    'global':{
        'server.socket_host'  : '192.168.178.26',
        'server.socket_port'  : 8080,
        'environment':'production',
        'tools.mako.directories' : [os.path.join(localDir,'templates')],
        'log.screen' : True,
        'log.access_file' : 'logs.txt',
        #'server.ssl_module' : 'pyopenssl',
        #'server.ssl_certificate': CA,
        #'server.ssl_private_key': KEY,
        'tools.sessions.on': True,
        'tools.auth.on': True,
        
        
    },
    
    '/': {'tools.staticdir.root': os.path.abspath(os.getcwd()),
          'tools.response_headers.on': True,
        },
    '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(localDir,'public')
        },
        '/table': {'request.dispatch' : cherrypy.dispatch.MethodDispatcher(),
                     'tools.response_headers.on': True,
                      'tools.response_headers.headers': [('Content-Type', 'text/plain')]
                    },
        '/register': {'request.dispatch' : cherrypy.dispatch.MethodDispatcher(),
                      'tools.response_headers.on': True,
                      'tools.response_headers.headers': [('Content-Type', 'text/plain')]
        },
        '/save': {'request.dispatch' : cherrypy.dispatch.MethodDispatcher(),
                      'tools.response_headers.on': True,
                      'tools.response_headers.headers': [('Content-Type', 'application/json')]
        },
        
        
}
    
    
    
    webapp = Root()
    webapp.register = appDatabaseRegister()
    webapp.table =appEndPointTableGet()
    webapp.save = appEndPointTableSave()
   
    
    cherrypy.quickstart(webapp, '/', config=_cp_config)