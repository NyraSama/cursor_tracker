# cursor_tracker
This is a POC done while learning Kafka. It consists in a tracker of many cursors connected at the same time on it.

## Get started

To start you need:

To setup a kafka broker, follow these instructions :
- Launch a terminal on the root of the repo
- Type `docker compose up -d`
  Some containers are created, you have now a broker running on *localhost:19092*
- Open a browser on *localhost:8080*
- Create an account to use the admin panel
- Login to the admin panel with your account

To install the JS Dependencies: 
- Launch a terminal on the root of the repo
- Type `npm install`

To build the project
- Launch a terminal on the root of the repo
- Type `npm run build`

To run the server side
- Launch a terminal on the root of the repo
- Type `node server.js`

Now everything is setted up, you can open index.html in your browser to start using the cursor tracker.
