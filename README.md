# Live website

This repository sources our [live website](https://www.covideducationrecovery.global/).

# Publishing updates
You must build this website on your local machine from the beta website repository before pushing changes to this repository. See the [beta website](https://github.com/covideducationrecovery/beta-website)'s repository readme for details on how to do this.


# Local testing (just in case you absolutely must)
Since this repository contains a compiled website, don't use `jekyll serve -w`. Instead, to do any local testing, run the following:

```
ruby -rwebrick -e 'WEBrick::HTTPServer.new(:Port=>4000,:DocumentRoot=>".").start'
```

and then [open the website](http://localhost:4000/) in your browser.