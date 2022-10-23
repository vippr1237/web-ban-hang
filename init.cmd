@ECHO OFF
ECHO Generate .env file
(
echo MONGODB_URL=mongodb://admin:admin123@localhost:27017/project-tracker
echo NODE_ENV=development

echo CLOUD_API_KEY = YOUR_CLOUD_API_KEY
echo CLOUD_API_SECRET = YOUR_CLOUD_API_SECRET
echo CLOUD_NAME = YOUR_CLOUD_NAME


echo REFRESH_TOKEN_SECRET =qwesndjgnsjdo
echo ACCESS_TOKEN_SECRET =asjdfnsjdngojsnd
) > .env