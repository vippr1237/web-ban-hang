@ECHO OFF
ECHO Generate .env file
(
echo MONGODB_URL=mongodb://admin:admin123@localhost:27017/ecommerce-site
echo NODE_ENV=development

echo REFRESH_TOKEN_SECRET =qwesndjgnsjdo
echo ACCESS_TOKEN_SECRET =asjdfnsjdngojsnd
) > .env