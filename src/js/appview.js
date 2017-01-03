

var drawer = document.querySelector('#drawer');
function AppViewModel() {
    this.findType = "Restaurants";
    this.findPlace = "Bellevue,WA";
    this.menuClick = function(e) {
       drawer.classList.toggle('open');
        // e.stopPropagation();
    };
    this.mainClick = function(e) {
        drawer.classList.remove('open');
    }
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());