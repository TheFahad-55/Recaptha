const express = require("express");

const request = require("request");

const path = require("path");

const app = express();

const morgan = require("morgan");

const colors = require("colors");

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

app.use(morgan("dev"));

app.post("/subscribe", (req, res) => {
    console.log(req.body);
    if (req.body.captha === undefined ||
        req.body.captha === '' ||
        req.body.captha === null || !req.body.captha) {
        return res.status(400).json({
            success: false,
            message: "Please Make Sure To Perform Captha",
        });
    }
    //Secret Key............
    const secretKey = "6LdUqMsZAAAAANBmE69Ya85i__d23O6ycLpF3pzA";
    //verify url..............
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captha}&remoteip={req.connection.remoteAddress}`;

    request(url, (err, response, body) => {

        //If Not Successfullll.

        body = JSON.parse(body);
        if (!body.success && body.success !== undefined) {
            return res.status(400).json({
                success: false,
                message: "Captha failed",
            });
        }
        //If Successful.....
        return res.json({
            success: true,
            message: "Captha Passed",
        });
    });
});

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on the port ${port}`.bgMagenta);
});