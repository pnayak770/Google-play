<script>
        const wrapIt = document.querySelector(".wrapIt");
        const myCarousel = document.querySelector(".myCarousel");
        const firstmyCardWidth = myCarousel.querySelector(".myCard").offsetWidth;
        const arrowBtns = document.querySelectorAll(".wrapIt i");
        const myCarouselChildrens = [...myCarousel.children];

        let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

        // Get the number of myCards that can fit in the myCarousel at once
        let myCardPerView = Math.round(myCarousel.offsetWidth / firstmyCardWidth);

        // Insert copies of the last few myCards to beginning of myCarousel for infinite scrolling
        myCarouselChildrens.slice(-myCardPerView).reverse().forEach(myCard => {
            myCarousel.insertAdjacentHTML("afterbegin", myCard.outerHTML);
        });

        // Insert copies of the first few myCards to end of myCarousel for infinite scrolling
        myCarouselChildrens.slice(0, myCardPerView).forEach(myCard => {
            myCarousel.insertAdjacentHTML("beforeend", myCard.outerHTML);
        });

        // Scroll the myCarousel at appropriate postition to hide first few duplicate myCards on Firefox
        myCarousel.classList.add("no-transition");
        myCarousel.scrollLeft = myCarousel.offsetWidth;
        myCarousel.classList.remove("no-transition");

        // Add event listeners for the arrow buttons to scroll the myCarousel left and right
        arrowBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                myCarousel.scrollLeft += btn.id == "left" ? -firstmyCardWidth : firstmyCardWidth;
            });
        });

        const dragStart = (e) => {
            isDragging = true;
            myCarousel.classList.add("dragging");
            // Records the initial cursor and scroll position of the myCarousel
            startX = e.pageX;
            startScrollLeft = myCarousel.scrollLeft;
        }

        const dragging = (e) => {
            if (!isDragging) return; // if isDragging is false return from here
            // Updates the scroll position of the myCarousel based on the cursor movement
            myCarousel.scrollLeft = startScrollLeft - (e.pageX - startX);
        }

        const dragStop = () => {
            isDragging = false;
            myCarousel.classList.remove("dragging");
        }

        const infiniteScroll = () => {
            // If the myCarousel is at the beginning, scroll to the end
            if (myCarousel.scrollLeft === 0) {
                myCarousel.classList.add("no-transition");
                myCarousel.scrollLeft = myCarousel.scrollWidth - (2 * myCarousel.offsetWidth);
                myCarousel.classList.remove("no-transition");
            }
            // If the myCarousel is at the end, scroll to the beginning
            else if (Math.ceil(myCarousel.scrollLeft) === myCarousel.scrollWidth - myCarousel.offsetWidth) {
                myCarousel.classList.add("no-transition");
                myCarousel.scrollLeft = myCarousel.offsetWidth;
                myCarousel.classList.remove("no-transition");
            }

            // Clear existing timeout & start autoplay if mouse is not hovering over myCarousel
            clearTimeout(timeoutId);
            if (!wrapIt.matches(":hover")) autoPlay();
        }

        const autoPlay = () => {
            if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
            // Autoplay the myCarousel after every 2500 ms
            timeoutId = setTimeout(() => myCarousel.scrollLeft += firstmyCardWidth, 2500);
        }
        autoPlay();

        myCarousel.addEventListener("mousedown", dragStart);
        myCarousel.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragStop);
        myCarousel.addEventListener("scroll", infiniteScroll);
        wrapIt.addEventListener("mouseenter", () => clearTimeout(timeoutId));
        wrapIt.addEventListener("mouseleave", autoPlay);

    </script>