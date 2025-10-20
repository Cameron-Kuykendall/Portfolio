//STARS
document.addEventListener("DOMContentLoaded", () => {
  const starsContainer = document.createElement("div");
  starsContainer.className = "stars";

  const numStars = 500; // Adjust the number of stars as needed

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 3 + 1; // Random star size
    const positionX = Math.random() * 100; // Random position across width
    const positionY = Math.random() * 100; // Random position across height
    const delay = Math.random() * 5; // Random animation delay

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${positionX}%`;
    star.style.top = `${positionY}%`;
    star.style.animationDelay = `${delay}s`;

    starsContainer.appendChild(star);
  }

  document.body.appendChild(starsContainer);
});

// Select all carousel containers
const carousels = document.querySelectorAll(".carousel");

carousels.forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const images = Array.from(track.children);
  const indicators = Array.from(carousel.querySelectorAll(".indicator"));

  let currentIndex = 0;

  const updateCarousel = () => {
    const imageWidth = images[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    updateIndicators();
  };

  const updateIndicators = () => {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  };

  const moveToImage = (index) => {
    currentIndex = index;
    updateCarousel();
  };

  // Set up interval for automatic transition
  let autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }, 3000);

  // Add click event listeners to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      moveToImage(index);
      clearInterval(autoSlide); // Stop auto-slide when a user interacts
      autoSlide = setInterval(() => {
        // Restart auto-slide
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
      }, 3000);
    });
  });

  // Adjust carousel on window resize
  window.addEventListener("resize", updateCarousel);

  // Initialize the carousel position
  updateCarousel();
});
window.addEventListener("scroll", () => {
  console.log(`Current scroll position: ${window.scrollY}`);
  console.log(window.innerWidth);
});
///header change
const header1 = document.querySelector("#header-1");
const header2 = document.querySelector("#header-2");
const header3 = document.querySelector("#header-3");
const header4 = document.querySelector("#header-4");

window.addEventListener("scroll", () => {
  if (window.scrollY < 600) {
    header1.classList.add("header-active");
    header2.classList.remove("header-active");
    header3.classList.remove("header-active");
    header4.classList.remove("header-active");
  }

  if (window.scrollY > 750 && window.scrollY < 1450) {
    header2.classList.add("header-active");
    header3.classList.remove("header-active");
    header1.classList.remove("header-active");
    header4.classList.remove("header-active");
  }
  if (window.scrollY > 1450) {
    header3.classList.add("header-active");
    header2.classList.remove("header-active");
    header4.classList.remove("header-active");
  }
  if (window.innerWidth < 430) {
    if (window.scrollY > 3700) {
      header4.classList.add("header-active");
      header3.classList.remove("header-active");
      header2.classList.remove("header-active");
      header1.classList.remove("header-active");
    }
  } else {
    if (window.scrollY > 4600) {
      header4.classList.add("header-active");
      header3.classList.remove("header-active");
      header2.classList.remove("header-active");
    }
  }
});

//backend
document
  .getElementById("contact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Access the fields using the correct IDs or name attributes
    const name = e.target.Name.value;
    const email = e.target.Email.value;
    const message = e.target.Message.value;

    const feedback = document.getElementById("feedback");

    try {
      const response = await fetch("/.netlify/functions/send-email", {
        // Ensure correct path to Netlify function
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json().catch(() => ({ message: "" }));
      if (response.ok) {
        feedback.textContent = data.message || "Email sent successfully!";
        feedback.style.color = "green";
        e.target.reset();
      } else {
        feedback.textContent =
          data.message || "Failed to send email. Please try again.";
        feedback.style.color = "red";
      }
    } catch (error) {
      feedback.textContent = "Failed to send email. Please try again.";
      feedback.style.color = "red";
    }
  });
