# REST API for Genesis Test
## API for getting current BTC to UAH exchange rate and its further sending to the subscribers.
This API is an implementation of a task for the Preliminary examination held by Genesis Education. Swagger documentation for the task: https://github.com/AndriiPopovych/gses/blob/main/gses2swagger.yaml.

__Project author:__ Verkhohliad Kateryna

__Project language:__ JavaScript (Node.js)
## Basic usage
### URL Structure
`http://gses2.app/api/{endpoint}`
### Endpoints
-	`/rate`
Accepts GET request. No parameters. Responses with the current BTC to UAH exchange rate.
-	`/subscribe`
Accepts POST request. Required parameter: required field “email” from a form data. Tries to subscribe an email obtaineed from request for the further exchange rate mailing. Responses with status 200 if the email has been successfully subscribed, with status 409 if the email has already been subscribed, otherwise the response status is 500.
-	`/sendEmails`
Accepts POST request. No parameters. Sends emails with the current BTC to UAH exchange rate to the subscribers.

### Customizing
In order to send messages via this API make sure to set required Environment variables to the appropriate values and change those default values of which are not satisfting.

__Required variables:__

`EMAIL_USER_NAME` – a sender’s/transporter’s email address.

`EMAIL_PASSWORD` – a sender’s password.

If the sender’s email service is other than ‘Gmail’ make sure to specify the `EMAIL_SERVICE` variable.

__Other options:__

`EMAIL_SUBJECT` – email subject (by default: “Поточний курс біткоїна в гривні”)

`EMAIL_TEXT` – email text (by default: “1 BTC = %r% UAH”). Note: `%r%` - is a placeholder for the exchange rate value. When specifying this variable make sure to insert “%r%” to the place where you want the value to appear.

## Additional features
### Automatic sending
Once an hour the API checks current exchange rate state and send emails containing the updated value to all the subscribers if the rate has changed since the last fetch.
