﻿#target indesign/* * CONFIG * KNOWN BUGS:  - position of the rectangles varies. *              - centered rotation doesnt work, because of anchorpoint top left? */var config = {    pageWidth:      200,    pageHeight:     200,    gutter:         2,    lineHeight:     2,    fontFamily:     'Dezen Pro	_Heavy',    contents:       [                        'Alien',                        'Summer',                        '---',                        'The Toxic Avenger - Redial Remix',                        'Electro Music'                    ],    backgroundSwatch: Math.round((Math.random() * 5) + 4)};config.margins = {    top:            20,    right:          40,    bottom:         20,    left:           40};config.bounds = {    top:            config.margins.top,    right:          config.pageWidth - config.margins.right,    bottom:         config.pageHeight - config.margins.bottom,    left:           config.margins.left,    width:          config.pageWidth - (config.margins.right + config.margins.left),    height:         config.pageHeight - (config.margins.top + config.margins.bottom)};config.customization = {    shadow:         1,    shear:          0,    rotate:         0,    centered:       1};    config.shadow = {    left: 0.5,    top: 0.5};config.shear = {    angle: 15};config.rotate = {    angle: 15};/* * Helper Functions */var helpers = {    size: function(obj) {        var rtn = {            height:     obj.geometricBounds[2] - obj.geometricBounds[0],            width:      obj.geometricBounds[3] - obj.geometricBounds[1]        };        rtn.multiplier = config.bounds.width / rtn.width;        return rtn;    }};/* * MAIN SETUP */// add a new documentvar doc = app.documents.add({    documentPreferences: {        pageWidth:      config.pageWidth,        pageHeight:     config.pageHeight,        facingPages:    false    }});// get first page from documentvar page = doc.pages.firstItem();// set page boundariespage.marginPreferences.properties = {    top:                config.margins.top,    right:              config.margins.right,    bottom:             config.margins.bottom,    left:               config.margins.left};// add a background rectangle - lockedvar bg = page.rectangles.add({    geometricBounds:    [                            0,                            0,                            config.pageHeight,                            config.pageWidth                        ],    fillColor:          doc.swatches.item(config.backgroundSwatch),    strokeWeight:       0,    locked:             true});/* * GENERATE ALL TEXTFRAMES AND CONVERT TO POLYGONS */var tfArray     = [];var polyArray   = [];config.contents = config.contents.reverse();for(var i = 0; i < config.contents.length; i++) {        // push to textframes-array    if(config.contents[i] !== '---') {                tfArray.push(page.textFrames.add({            geometricBounds:    [                                    config.bounds.top,                                    config.bounds.left,                                    config.bounds.bottom,                                    config.bounds.right                                ],            contents:           config.contents[i]        }));        // get the first paragraph from the textframe        var p = tfArray[i].paragraphs.firstItem();        p.properties = {            appliedFont:        config.fontFamily,            fillColor:          doc.swatches.item(2),            fillTint:           80        };        // change text to uppercase        p.changecase(ChangecaseMode.UPPERCASE);                // convert to polygons        tfArray[i].createOutlines();                // get the polygon and push it to poly-array        polyArray.push(page.polygons.item(i));            } else {                // add a rect to the poly array        var line = page.rectangles.add({            geometricBounds: [                                config.bounds.top,                                config.bounds.left,                                config.bounds.top + config.lineHeight,                                config.bounds.right                             ],            fillColor:       doc.swatches.item(3),            strokeWeight:    0,            fillTint:        90        });            polyArray.push(page.rectangles.firstItem());        config.contents.splice(i, 1);        i--;        }            }/* * SIZE AND POSITION ALL POLYGONS TO THE RIGHT POSITION */var history = {    height: config.bounds.top};// size polygonsfor(var i = 0; i < page.polygons.length; i++) {        var p = page.polygons;    var size = helpers.size(p.item(i));    p.item(i).resize(        CoordinateSpaces.PAGE_COORDINATES,        AnchorPoint.TOP_LEFT_ANCHOR,        ResizeMethods.MULTIPLYING_CURRENT_DIMENSIONS_BY,        [size.multiplier, size.multiplier]    );               }// move rectangles and polygon to right positionfor(var i = 0; i < polyArray.length; i++) {        polyArray[i].move([config.bounds.left, history.height]);    history.height += helpers.size(polyArray[i]).height + config.gutter;    }// add polyArray to a grouppage.groups.add(polyArray);// get the groupvar group = page.groups.firstItem();/* * ADDITIONAL CUSTOMIZATIONS */// if shadow is turned on, duplicate groupif(config.customization.shadow) {            // duplicate the first group    group.duplicate([        config.bounds.left + config.shadow.left,        config.bounds.top + config.shadow.top    ]).sendBackward();              // get the new duplicated group    var duplicated = page.groups.lastItem();    // fill all polygons to black    duplicated.polygons.everyItem().properties = {        fillColor:  doc.swatches.item(1),        fillTint:   100    };    // fill all rectangles to black    duplicated.rectangles.everyItem().properties = {        fillColor:  doc.swatches.item(1),        fillTint:   100    };}// if shear is turned on, shear it with the transformation matrixif(config.customization.shear) {        var shear = app.transformationMatrices.add();    shear = shear.shearMatrix(config.shear.angle);    group.transform(        CoordinateSpaces.PASTEBOARD_COORDINATES,        AnchorPoint.centerAnchor,        shear    );        if(config.customization.shadow) {        duplicated.transform(            CoordinateSpaces.PASTEBOARD_COORDINATES,            AnchorPoint.centerAnchor,            shear        );    }    }// if rotation is turned on, rotate it with the transformation matrixif(config.customization.rotate) {        var rotate = app.transformationMatrices.add();    rotate = rotate.rotateMatrix(config.rotate.angle);    group.transform(        CoordinateSpaces.PASTEBOARD_COORDINATES,        AnchorPoint.centerAnchor,        rotate    );        if(config.customization.shadow) {        duplicated.transform(            CoordinateSpaces.PASTEBOARD_COORDINATES,            AnchorPoint.centerAnchor,            rotate);    }    }if(config.customization.centered) {    var size = helpers.size(group);    if(!config.customization.rotate) {        group.move([            (config.pageWidth / 2) - (size.width / 2),            (config.pageHeight / 2) - (size.height / 2)        ]);                           if(config.customization.shadow) {            duplicated.move([                (config.pageWidth / 2) - (size.width / 2) + config.shadow.left,                (config.pageHeight / 2) - (size.height / 2) + config.shadow.top            ]);        }    }}"woosh.";