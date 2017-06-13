const app = {
    init(selectors) {
        this.movies = []
        this.dinos = []
        this.max = 0
        this.movieList = document
            .querySelector(selectors.movieListSelector)
        this.dinoList = document
            .querySelector(selectors.dinoListSelector)
        this.template = document
            .querySelector(selectors.templateSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addFeedViaForm.bind(this))

        this.load()
    },

    /*-----------------------------------------
    Method to load the movie from localStorage
    ------------------------------------------*/
    load() {
        // Get the JSON string out of localStorage
        const moviesJSON = localStorage.getItem('Movies')
        const dinosJSON = localStorage.getItem('Dinos')

        // Turn that into an array
        const moviesArray = JSON.parse(moviesJSON)
        const dinosArray = JSON.parse(dinosJSON)

        // Set this.movies to that array
        if (moviesArray) {
            moviesArray
                .reverse()
                .map(this.addFeed.bind(this))
        }

        if (dinosArray){
            dinosArray
                .reverse()
                .map(this.addFeed.bind(this))
        }
    },

    addFeed(feed) {
        const listItem = this.renderListItem(feed)
        if(feed.category === 'Movies'){
            list = this.movieList
            arr = this.movies
        }
        else{
            list = this.dinoList
            arr = this.dinos
        }

        list.insertBefore(listItem, list.firstChild)
        arr.unshift(feed)
        

        if(feed.id > this.max){
            this.max = feed.id
        }

        this.save()
       
    },

    addFeedViaForm(ev) {
        ev.preventDefault()
        const f = ev.target
        if(f.category.value === 'Movies'){
            const movie = {
                id: this.max + 1,
                name: f.feedName.value,
                category: f.category.value,
                promote: false,
            }
            this.addFeed(movie)
            }
        else{
            const dino = {
                id: this.max + 1,
                name: f.feedName.value,
                category: f.category.value,
                promote: false,
            }
            this.addFeed(dino)
            }
        f.reset()
    },

    save() {
        localStorage
            .setItem('Movies', JSON.stringify(this.movies))

        localStorage
            .setItem('Dinos', JSON.stringify(this.dinos))

    },

    renderListItem(feed) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.dataset.id = feed.id

        if(feed.promote){
            item.classList.add('promote')
        }

        item
            .querySelector('.feed-name')
            .textContent = feed.name

        item
            .querySelector('.feed-category')
            .textContent = "Category: "+feed.category

        item
            .querySelector('button.remove')
            .addEventListener('click', this.removeFeed.bind(this, feed))

        item
            .querySelector('button.edit')
            .addEventListener('click', this.editText.bind(this,feed))

        item
            .querySelector('button.fav')
            .addEventListener('click', this.promoteFeed.bind(this, feed))

        item
            .querySelector('button.up')
            .addEventListener('click', this.moveUp.bind(this, feed))

        item
            .querySelector('button.down')
            .addEventListener('click', this.moveDown.bind(this, feed))

        return item
    },

    editText(feed, ev){
        const editbutton = ev.target
        const listItem = ev.target.closest('.feed')
        const feedName = listItem.children[2]
        if(feedName.isContentEditable){

            feedName.contentEditable = false
            editbutton.classList.add('fa-pencil-square-o')
            editbutton.classList.remove('fa-check')
            editbutton.classList.add('warning')
            editbutton.classList.remove('success')
            
            if(feed.category === 'Movies'){
                arr = this.movies
                }
            else{
                arr = this.dinos
                }
            
            // Find the feed in the array, and remove it
            for (let i = 0; i < arr.length; i++) {
                const currentId = arr[i].id.toString()
                if (listItem.dataset.id === currentId) {
                    arr[i].name = feedName.innerHTML
                    break
                }
            } 
            
            this.save()
            
        }
        else{
            //console.log("false")
            feedName.contentEditable = true
            feedName.focus()
            editbutton.classList.add('fa-check')
            editbutton.classList.remove('fa-pencil-square-o')
            editbutton.classList.remove('warning')
            editbutton.classList.add('success')
        }
    },

    promoteFeed(feed, ev){
        const listItem = ev.target.closest('.feed')
        feed.promote = !feed.promote

        // toggle promote
        listItem.classList.toggle('promote')
        this.save()
    },

    removeFeed(feed, ev) {
        const listItem = ev.target.closest('.feed')

        if(feed.category === 'Movies'){
            arr = this.movies
            }

        else{
            arr = this.dinos
            }
        // Find the feed in the array, and remove it
        for (let i = 0; i < arr.length; i++) {
            const currentId = arr[i].id.toString()
            if (listItem.dataset.id === currentId) {
                arr.splice(i, 1)
                break
            }
        }

        listItem.remove()
        this.save()
    },

    moveUp(feed, ev) {
        const li = ev.target.closest('.feed')
        if(feed.category === 'Movies'){
            arr = this.movies
            list = this.movieList
        }
        else{
            arr = this.dinos 
            list = this.dinoList
        }

        const index = arr.findIndex((currentFeed) => {
            return currentFeed.id === feed.id
        })

        if (index > 0) {
            // Changing the DOM
            list.insertBefore(li, li.previousElementSibling)

            //Swap the feed in the array
            const previousFeed = arr[index - 1]
            arr[index - 1] = feed
            arr[index] = previousFeed

            this.save()
        }
    },

    moveDown(feed, ev) {
        const li = ev.target.closest('.feed')
        if(feed.category === 'Movies'){
            arr = this.movies
            list = this.movieList
        }
        else{
            arr = this.dinos 
            list = this.dinoList
        }

        const index = this.movies.findIndex((currentFeed) => {
            return currentFeed.id === feed.id
        })

        if (index < arr.length - 1) {
            list.insertBefore(li.nextSibling, li)

            const nextFeed = arr[index + 1]
            arr[index + 1] = feed
            arr[index] = nextFeed

            this.save()
        }
    },
}

app.init({
    formSelector: '#feed-form',
    movieListSelector: '#movie-list',
    dinoListSelector: '#dino-list',
    templateSelector: '.feed.template',
})


function myFunction() {
    // Declare variables
    let input, filter, ul, li, a, i
    input = document.getElementById('searchField')
    filter = input.value.toUpperCase()
    ul = document.getElementById("movie-list")
    li = ul.getElementsByTagName('li')

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('span')[1]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        } else {
            li[i].style.display = "none"
        }
    }
    ul = document.getElementById("dino-list")
    li = ul.getElementsByTagName('li')

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('span')[1]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        } else {
            li[i].style.display = "none"
        }
    }
}


