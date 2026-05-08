\============================  
Resume Next Time  
continue from [PROGRESS.md](http://PROGRESS.md)  
\============================  
Java Institute Holdings server   
Contabo [admin@jihltd.com](mailto:admin@jihltd.com)  
\============================  
root@5.189.163.58  
un: root  
pw: wY0dnx30SJaY   
\============================================  
GitHub SSH Public Key  
SHA256:Y3k/2ZWU5OBNYb4UymLtrfC2wTz8PwP0oRCwdC2DxSM  
\==================================================  
Connect to root of the Server: ssh root@5.189.163.58  
get tokens: https://github.com/settings/tokens

GitHub repo: https://github.com/ExonSoftware/nedp\_iso\_system  
IP: 5.189.163.58

GitHub: SHA256:X/qk8JSDAEcs4KBA2rqrS/eQgdaATtvCn5tLoQxad2I  
	  
Termius/FileZilla 	Username: root   	Password: cJN7WPBCj3TgLo  Port: 22 	Plesk 	  
Username: root 	Password: wY0dnx30SJaY 	Port: 8443 	Glassfish/Tomcat 	Username: admin 	Password: wY0dnx30SJaY 	Port: 4848  

TOKEN: github\_pat\_11ARXSLDY0DCTwzRsXDmAX\_QDE0k3PFEhn9mRfMDpBqAwhlnJudAjUFspTFeAIj75TIK435JZZI79W1d8u

Development Access Guide.  
We are working on NEDP staging (Java EE / WildFly / MariaDB).

Workspace (code repo):  
/srv/nedp/staging/current

App server:  
WildFly home: /opt/wildfly  
WildFly service: wildfly (systemd)  
Logs: /opt/wildfly/standalone/log/server.log  
Deployments: /opt/wildfly/standalone/deployments

Domains:  
https://staging.jihltd.com  
https://preview.jihltd.com

Nginx vhosts:  
HTTP:  /etc/nginx/conf.d/nedp-staging.conf, /etc/nginx/conf.d/nedp-preview.conf  
HTTPS: /etc/nginx/conf.d/nedp-staging-ssl.conf, /etc/nginx/conf.d/nedp-preview-ssl.conf

Database:  
MariaDB DB: education\_db  
Datasource JNDI: java:/ds\_education\_db

What I want to do now:  
(1 sentence: example “push tags to github” or “debug login error”)

