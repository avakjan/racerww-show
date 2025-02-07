// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    const likeButton = document.getElementById('likeButton');
    const likeCountSpan = document.getElementById('likeCount');
    let count = 0;
    
    if (likeButton) {
      likeButton.addEventListener('click', function() {
        count++;
        likeCountSpan.textContent = count;
      });
    }
  });
  
document.addEventListener("DOMContentLoaded", function() {
  // Keep a map/dictionary of like counts per image src
  const imageLikes = {};

  // Grab all images in the gallery
  const galleryImages = document.querySelectorAll(".gallery img");

  // Create a modal (hidden by default)
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  modal.innerHTML = `
    <div class="image-modal-content">
      <span class="modal-close">&times;</span>
      <img class="modal-image" src="" alt="Enlarged Image"/>
      <div class="modal-likes">
        Likes: <span class="modal-like-count">0</span>
      </div>
      <button class="modal-like-btn">Like</button>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".modal-image");
  const modalLikeCountSpan = modal.querySelector(".modal-like-count");
  const modalLikeBtn = modal.querySelector(".modal-like-btn");
  const closeModal = modal.querySelector(".modal-close");

  // Close modal when the user clicks the [x]
  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // For each gallery image, open modal on click
  galleryImages.forEach((img) => {
    // Initialize each image's like count at 0 (or only if not set)
    if (imageLikes[img.src] == null) {
      imageLikes[img.src] = 0;
    }

    img.addEventListener("click", function() {
      // Show the modal
      modal.style.display = "block";
      // Set the modal image to the clicked image's src
      modalImg.src = this.src;
      // Update the displayed like count
      modalLikeCountSpan.textContent = imageLikes[this.src];
    });
  });

  // Handle "Like" button inside modal
  modalLikeBtn.addEventListener("click", function() {
    // Increase like count for the current modal image
    const currentSrc = modalImg.src;
    imageLikes[currentSrc]++;
    modalLikeCountSpan.textContent = imageLikes[currentSrc];
  });
});
