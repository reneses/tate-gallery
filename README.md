# Tate gallery
Simple web gallery for the Tate Gallery build with Node.js + Express + Mongo

## Tate collection 
The Tate collection can be found and used at [their GitHub](https://github.com/tategallery/collection).

## Online demo 
An online demo can be found at: https://tate-gallery.herokuapp.com

## Requirements
- Node (+ NPM)
- Mongo

## Installation
Simply make the installation script executable and run it
```
chmod +x install.sh
./install.sh
```

## Execution
The program expects a Mongo DB running, and will use two collections: `artists` and `artworks`. If you are using heroku or any solution, just configure the `.env` file. If you prefer it, the configuration can also be manually altered in the `db.js` file.

If you will use Mongo within your computer, the scripts `start-mongo.sh` and `stop-mongo.sh` will simplify the process. 

The web server can be started with
```
npm start
```
