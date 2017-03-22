/*  */
exports.PageGroup = function(obj) {
        this.name = obj.name; // (Mandatory) is also the id of the page group
        this.type = 'group';
        
        var children = []; // the children navigation objects -> format  {type: page|group, data: {} }

        this.addChild = function(obj) {
            try {
                children.push(obj);
                sortChildren();
            }
            catch (e) {
                console.error(e);
            }

        }

        this.editChild = function(index, obj) {
            try {
                children[index] = obj;
                sortChildren();
            }
            catch (e) {
                console.error(e);
            }

        }

        this.deleteChild = function(index) {
            try {
                children.splice(index, 1);
                sortChildren();
            }
            catch (e) {
                console.error(e);
            }

        }

        this.getChildren = function() {
            return children;
        }

        function sortChildren() {
            try {
                children.sort(function(a, b) {
                    return a.name - b.name
                });
            }
            catch (e) {
                console.error(e);
            }

        }

        return this;
    }
    /*  */
exports.Page = function(obj) {
    this.name = obj.name; // (Mandatory) name of the page
    this.path = obj.path; // (Mandatory) path to the page, and is also the id of the page group
    this.type = 'page';

    return this;
}
