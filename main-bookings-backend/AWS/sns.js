// IMPORT (Main)
const sns = require('./main').sns;

// Topic ARN
let topicARN = 'arn:aws:sns:us-east-1:325913046401:rebook-notif'

// Register New User
let registerSNS = (email) => {
    sns.listSubscriptionsByTopic({
        TopicArn: topicARN, /* required */
    }, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            let subs = data.Subscriptions
            for (let i = 0; i < subs.length; i++) {
                let endPoint = subs[i].Endpoint
                if (endPoint == email) {
                    return res.send('user already subscribed').end()
                }
            }
            sns.subscribe({
                Protocol: 'Email', /* required */
                TopicArn: topicARN, /* required */
                Endpoint: email,
                ReturnSubscriptionArn: true || false
            }, (err, data) => {
                if (err) {
                    console.log(err, err.stack)
                    return res.send('error').end() // an error occurred
                }
                else {
                    console.log(data)
                    return res.send('user successfully subscribed').end() // successful response
                }
            })
        }
    })
}

// Rebooking Notification

var params = {
    Message: `Dear Visitor, \n\nHi from Farrer Park Hospital. Unfortunately, the quota for visitation has been changed and your slot has been cancelled. Please rebook your slot again using your app. \n\nRegards, \nFarrer Park Hospital`, /* required */
    Subject: 'Appointment cancelled',
    // TargetArn: 'STRING_VALUE',
    TopicArn: topicARN,
}
sns.publish(params, function (err, data) {
    if (err) {
        console.log(err, err.stack)
        res.send('message failed')
    }    // an error occurred
    else {
        console.log(data)
        res.send('message success')
    }         // successful response
})

// EXPORT Modules
module.exports = {registerSNS}