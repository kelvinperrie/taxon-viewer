
var TaxonViewier = function(data, containerSelector) {
    var self = this;

    self.data = data;
    self.containerSelector = containerSelector;
    self.container = $(containerSelector);

    const paddingLeft = 30;
    const paddingRight = 30;
    const paddingTop = 30;
    const taxonWidth = 300;
    const taxonHeight = 100;
    const taxonHorizontalGap = 100;
    const taxonVerticalGap = 30;

    self.currentRow = 0;
    self.joins = [];

    self.draw = function() {

        self.drawTaxon(data, 0, 0);
        console.log(data);
    };

    self.createJoin = function(fromRow, toRow, column, isLastChild) {
        var left = paddingLeft + taxonWidth + (column * (taxonWidth + taxonHorizontalGap));
        var top = paddingTop + (fromRow * (taxonHeight + taxonVerticalGap));
        var height = (toRow - fromRow) * (taxonHeight + taxonVerticalGap) + taxonHeight;
        var width = taxonHorizontalGap;
        var halfHorizontalGap = width / 2;
        var curveRadius = 30;
        var curveStartHeight = (taxonHeight / 2);
        var curveStartX = halfHorizontalGap - curveRadius;

        var path = "";
        if(fromRow === toRow) {
            var x = taxonHeight / 2;
            path = "<path d='M 0 " + x + " L " + taxonHorizontalGap + " " + x + "' />";

        } else if (isLastChild) {
            var lineHeight = height - (taxonHeight / 2) - curveRadius; 
            var initialCurve = "M "+curveStartX+" " + curveStartHeight + " Q "+halfHorizontalGap+" " + curveStartHeight + " "+halfHorizontalGap+" "+(curveStartHeight+curveRadius)+" ";
            var line = "L "+halfHorizontalGap+" " + lineHeight;
            var finalCurve = " Q "+ halfHorizontalGap+" "+ (lineHeight + curveRadius) +" "+(halfHorizontalGap+curveRadius)+" " + (lineHeight + curveRadius);
            var finalLine = " L " + width + " " + (lineHeight + curveRadius);
             
            path = "<path fill='none' class='dtc-canvas-path' d='" + initialCurve + line + finalCurve + finalLine + "' />";
        } else {
            var lineHeight = height - (taxonHeight / 2) - curveRadius; 
            var moveTo = "M "+halfHorizontalGap+" " + lineHeight;
            var finalCurve = " Q "+ halfHorizontalGap+" "+ (lineHeight + curveRadius) +" "+(halfHorizontalGap+curveRadius)+" " + (lineHeight + curveRadius);
            var finalLine = " L " + width + " " + (lineHeight + curveRadius);

            path = "<path fill='none' class='dtc-canvas-path' d='" + moveTo + finalCurve + finalLine + "' />";
        }

        var element = "<svg class='taxon-join' style='top: " + top + "px;height: " + height + "px;width: " + width + "px; left: " + left + "px;'>"+ path +"</svg>";

        self.container.append(element);
    };

    self.drawTaxon = function(taxon, currentColumn) {
        console.log("drawing "+ taxon.name);
        taxon.row = self.currentRow;
        var left = paddingLeft + (currentColumn * (taxonWidth + taxonHorizontalGap));
        var top = paddingTop + (self.currentRow * (taxonHeight + taxonVerticalGap));

        var image = "";
        if(taxon.photo) { 
            image = "<span class='taxon-image'><img src=" + taxon.photo + " /></span>"; 
        }
        var elementContent = "<div class='taxon-content'>"+image+"<div class='taxon-text-container'><div class='taxon-name'>"+taxon.name+"</div><div class='taxon-common-name'>"+taxon.commonName+"</div></div></div>"
        var element = "<div class='taxon-item-container' style='top: " + top + "px; left: " + left + "px;'>"+elementContent+"</div>";

        self.container.append(element);

        for(var childIterator = 0; childIterator < taxon.children.length; childIterator++) {
            console.log("need a join from " + taxon.row + " to row " + self.currentRow)
            self.createJoin(taxon.row, self.currentRow, currentColumn, childIterator == taxon.children.length -1 )
            self.drawTaxon(taxon.children[childIterator], currentColumn + 1, self.currentRow);
            
            if(taxon.children.length-1 != childIterator) {
                self.currentRow = self.currentRow + 1;
            }
        }
    };
    self.draw ();
};