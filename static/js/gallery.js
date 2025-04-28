document.addEventListener('DOMContentLoaded', function() {
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'galleryModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'galleryModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered modal-lg';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'galleryModalLabel';
    modalTitle.textContent = 'Image Gallery';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body text-center';

    const modalImage = document.createElement('img');
    modalImage.className = 'img-fluid gallery-modal-image';
    modalImage.alt = 'Gallery Image';

    const prevButton = document.createElement('button');
    prevButton.className = 'btn btn-dark position-absolute start-0 top-50 translate-middle-y ms-3 d-none d-md-block';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.id = 'gallery-prev';

    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-dark position-absolute end-0 top-50 translate-middle-y me-3 d-none d-md-block';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.id = 'gallery-next';

    // Assemble modal
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    modalBody.appendChild(modalImage);
    modalBody.appendChild(prevButton);
    modalBody.appendChild(nextButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const galleryModal = new bootstrap.Modal(modal);

    // Track current image index
    let currentIndex = 0;

    // Add click event to all gallery images
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            currentIndex = index;
            updateModalImage();
            galleryModal.show();
        });
    });

    // Update modal image based on current index
    function updateModalImage() {
        const currentImage = galleryImages[currentIndex];
        modalImage.src = currentImage.src;
        modalTitle.textContent = currentImage.alt || 'Gallery Image';
    }

    // Previous button click handler
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage();
    });

    // Next button click handler
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateModalImage();
    });

    // Keyboard navigation
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
});
