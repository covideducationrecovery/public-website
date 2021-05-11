# BETA WEBSITE

This repository sources our [testing website](https://beta.covideducationrecovery.global/). The information on this site may be out of date, presented incorrectly, or otherwise generally unreliable.


# Local Testing
To test this site locally, run
```
beta-website     % jekyll serve -w
```
and access the site at http://localhost:5002/

(Press `CTRL+C` in your terminal window to stop the web server.)


# Configuring for production deployment

Ensure that you have two folders - one for this repository and one for the public website in the same parent folder
```
[parent folder]
 |- /beta-website
 |- /public-website 
```

You can do this by running the following commands:
```
[parent folder] % git clone https://github.com/covideducationrecovery/beta-website.git
[parent folder] % git clone https://github.com/covideducationrecovery/public-website.git
```

# Deploying to Production
The [public-website](https://github.com/covideducationrecovery/public-website) repository does not contain the source files. When you have tested your changes to the beta-website repository, you can deploy it by entering the following commands:

```
beta-website     % jekyll build --config _config.yml,_config-public.yml --safe
beta-website     % cd ../public-website
public-website   % git add -A
public-website   % git commit -m "[your update summary]"
public-website   % git push origin master
```

Note the spacing in the first command is important. If there is a space following the comma, jekyll will ignore the second configuration file.
