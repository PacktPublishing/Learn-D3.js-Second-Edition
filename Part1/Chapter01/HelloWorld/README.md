# Chapter01/HelloWorld

Simple examples using D3 and HTML to test your installation.

## 1) Description of each file in this folder

__`1-svg-circle.html`__

Drawing a circle in a HTML page using SVG.

__`2-d3-append.html`__
    
Dynamically drawing a circle in a HTML page using D3.

__`3-binding-data.html`__
    
Binding a piece of data to the dynamically generated SVG code and drawing a circle using that data.

__`4-binding-data.html`__
    
Binding an array of several elements to generate several circles in different places.

__`5-updating.html`__
    
Updating the data and forcing the circles to be immediately repositioned according to the new data.

__`6-transition.html`__
    
Animating the update so that the circles take one second to move to their new places.
    

## 2) How to run these examples

Any IDE or code editor that you use to edit HTML files can be used.

You need to be connected to the Internet, since all examples download the D3 library from a CDN (see other ways to load the library in the `/Imports` folder).

You also need to serve the files through a local web server. Most examples won't work if you simply open the file in a browser. You can get one automatically if you use an IDE such as *JetBrains WebStorm* or *Visual Studio Code* (with the *Live Preview extension*). Both of these IDEs are great options and are free to use while you learn. *WebStorm*
is free for any non-commercial use. You can start using it out-of-the-box, since no configuration is necessary. *Visual Studio Code* is free for any use, commercial or not, but you need to set it up and install a plug-in for automatic preview through a Web server. 

If you prefer you can also use your console terminal to install (if necessary) and run a command-line server. If you have NPM installed (see `Appendix/`, install a simple web server using:

   ```npm install http-server```

then move to the folder where your HTML files are stored (your document root) and run:

   ```http-server```

You can now preview your files using http://localhost:8080/

## 4) Loading the D3 library

The `Imports/` folder contains several examples of how to load the D3 library in a frontend environment, using ESM and legacy techniques.

Note that we decided to not use an `npm` setup for D3 for the files in this repository (we import ESM libraries for all examples via CDN), but if you already use `npm`, you can setup D3 using it and import from your local `node_modules` folder (see `Appendix/Environment` for an example of this setup).

CDNs sometimes fail. There are several CDN options for D3. Most examples in this repository use https://cdn.jsdelivr.net/npm/d3@7/+esm or https://cdn.skypack.dev/d3@7. If you have problems with one, try another one.


## 4) Using a cloud-based editor

You can also cut and paste the examples in a cloud-based IDE such as _CodePen_ or _JSFiddle_, which are popular, very easy to use and require minimum configuration (you just need to configure it informing the CDN URL of the D3 library).
You can start by forking the following examples, which are already set up. They contain the code from `Chapter01/HelloWorld/2-d3-append.html`:

- JSFiddle: [Single circle](https://jsfiddle.net/helderdarocha/93fty6zh/1/)
- CodePen:  [Single circle](https://codepen.io/helderdarocha/pen/xxazVeN)

(You can also use these environments without any configuration, importing the ESM modules directly in the code window, but you may encounter some limitations or bugs.)

Other steps are also available in the following links:
- CodePen: [Many circles](https://codepen.io/helderdarocha/pen/ZYzmaOE), [Updating circles](https://codepen.io/helderdarocha/pen/ZYzmapY)
- JSFiddle: [Many circles](https://jsfiddle.net/ux07qkaL/), [Updating circles](https://jsfiddle.net/6s4Lvpnb/)

Note: the D3 library is not imported via code in the JS tab in these examples (it is added as a resource via the platform's configuration tools).

These are great to experiment with the code as you learn. Both have a console that help with debugging. You can modify the code as much as you want, save it and share it. External files, however, will need to be loaded via a separate URL. You can use these environments to start using D3 quickly, and to share your code, but you should have
a local environment set up by the time you finish Chapter 4.

## 5) Observable notebooks

_Observable_ notebooks are a playground where you can run code interactively. You can use them to experiment with code and see the results immediately. You can view and interact with the examples from this chapter here:

[HelloWorld examples](https://observablehq.com/d/1e3acb60dca93ea6)

More examples and exercises are also available here:
[More examples](https://observablehq.com/d/90d319473e8012ae)

Programming for a notebook is slightly different from programming in a code editor, but it's a great way to learn and share your code. In most chapters, selected examples will also be available in *Observable* notebooks.



