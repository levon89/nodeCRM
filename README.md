# nodeCRM
Warehouse web application(mongoDB,expressJS,angularJS,nodeJS)
This is my my fist web application for small buisness.

Used technologies
1)Angular-UI (https://angular-ui.github.io/bootstrap/)
2)AngularJS
3)mongoose NPM
4)body-parser NPM
5)cookie-parser NPM
6)PUG NPM
7)UUID-TOKEN-GENERATOR NPM

To launch this web application you need to install nodejs(https://nodejs.org/en/) . After all via CMD navigate to folder where YOU want to install expressJS (https://expressjs.com/) framework server for nodeJS(CRM was developed via expressJS framework).Download project from GITHUB and copy to folder from where you want to run .Now we need to install mongoDB (https://www.mongodb.com/mongodb-3.6) database(now latest version is 3.6). If you have trubles you can see this tutorial(https://www.youtube.com/watch?v=pWbMrx5rVBE) . Set db username admin, password 12345(do not worry it is safe because your DB will not be online).Now after we install our mongoDB we need tool to work with it, because originally mongoDB require to work with CMD(monogoDb compass (https://www.mongodb.com/download-center?filtr=enterprise#compass)) .  Then open compass and connect to your DB.In left side you will see two menu admin and local. Click on admin.After that in top you will see CREATE COLLECTION.You need to create three collection with noted names (solditems,users,warehouses).Now enter solditems collection and click INSERT DOCUMENT(do not change _id field).Look screenshot and do what you see in picture (https://imgur.com/a/uA418). After that go to warehouses collection and insert document as in this screenshot(https://imgur.com/a/04zsO)(do not change _id field).NOW WE NEED TO CREATE LOGIN PASSWORD.open users and inster doucument , INSTEAD OF admin write username or password which you want , here is screenshot(https://imgur.com/ZP5djrP) .
Now we finish setup our application and we need to launch it . Via CMD navigate to folder where you copy project files and type following command "node app.js". 

If you have questions do not hesitate please contact with me via e-mail:  levonisadjanyan@gmail.com.

ENJOY!!!
