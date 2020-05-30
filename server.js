const path = require("path");
const express = require("express");
const app = express();
app.use(express.static(__dirname + '/dist/JobbagPWA'));

app.get("/ngsw-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist/JobbagPWA", "ngsw-worker.js"));
  });

app.get('/*', function(req,res){
res.sendFile(path.join(__dirname, 'dist/JobbagPWA', 'index.html'));
});

console.log(`Server running and listening on port ${process.env.PORT || 8080}`);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
