# Email Image Scrapper 
Saves a local copy of images in any emails. Allows multiple files to be running at same time.

Place emails in "emails" folder. This will grab all emails in this folder and run them through
the scapping proccess.

- Email parsing will double check if image file already existed on the local file system or not. If exists, it skips the request to fetch a copy from remote url.

Run [npm install]
Then [node scrap.js]

Thats it.

The images will be save to the "saved-images" folder.


