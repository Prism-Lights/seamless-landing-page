document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // Header Scroll Effect
    // ---------------------------------------------
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ---------------------------------------------
    // Interactive Lighting Visualizer
    // ---------------------------------------------
    const dots = document.querySelectorAll('.light-dot');
    const presetButtons = document.querySelectorAll('.preset-btn');
    let animationInterval = null;
    let rainbowHueOffset = 0;

    // Preset configurations
    const presets = {
        'warm-white': {
            type: 'static',
            color: '#ff9d3b', // Warm candle light white 3000K
            glow: 'rgba(255, 157, 59, 0.8)'
        },
        'christmas': {
            type: 'dynamic',
            run: (step) => {
                dots.forEach((dot, index) => {
                    const color = (index + step) % 2 === 0 ? '#ff2e2e' : '#00d084';
                    const glowColor = (index + step) % 2 === 0 ? 'rgba(255, 46, 46, 0.8)' : 'rgba(0, 208, 132, 0.8)';
                    dot.style.fill = color;
                    dot.style.filter = `drop-shadow(0 0 6px ${glowColor})`;
                });
            },
            speed: 500
        },
        'patriotic': {
            type: 'dynamic',
            run: (step) => {
                dots.forEach((dot, index) => {
                    const patternIndex = (index + step) % 3;
                    let color, glowColor;
                    if (patternIndex === 0) {
                        color = '#ff2e2e'; // Red
                        glowColor = 'rgba(255, 46, 46, 0.8)';
                    } else if (patternIndex === 1) {
                        color = '#ffffff'; // White
                        glowColor = 'rgba(255, 255, 255, 0.8)';
                    } else {
                        color = '#0693e3'; // Royal Blue
                        glowColor = 'rgba(6, 147, 227, 0.8)';
                    }
                    dot.style.fill = color;
                    dot.style.filter = `drop-shadow(0 0 6px ${glowColor})`;
                });
            },
            speed: 400
        },
        'rainbow': {
            type: 'frame',
            run: () => {
                rainbowHueOffset = (rainbowHueOffset + 1) % 360;
                dots.forEach((dot, index) => {
                    // Spread hue across the roofline index
                    const hue = (index * 8 + rainbowHueOffset) % 360;
                    dot.style.fill = `hsl(${hue}, 100%, 60%)`;
                    dot.style.filter = `drop-shadow(0 0 6px hsl(${hue}, 100%, 60%))`;
                });
            }
        }
    };

    function clearAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        if (presets['rainbow'].requestId) {
            cancelAnimationFrame(presets['rainbow'].requestId);
            presets['rainbow'].requestId = null;
        }
    }

    function applyPreset(presetName) {
        clearAnimation();
        
        // Remove active class from buttons
        presetButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.preset-btn[data-preset="${presetName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        const preset = presets[presetName];
        if (!preset) return;

        if (preset.type === 'static') {
            dots.forEach(dot => {
                dot.style.fill = preset.color;
                dot.style.filter = `drop-shadow(0 0 6px ${preset.glow})`;
            });
        } else if (preset.type === 'dynamic') {
            let step = 0;
            preset.run(step);
            animationInterval = setInterval(() => {
                step++;
                preset.run(step);
            }, preset.speed);
        } else if (preset.type === 'frame') {
            const runFrame = () => {
                preset.run();
                preset.requestId = requestAnimationFrame(runFrame);
            };
            runFrame();
        }
    }

    // Set up visualizer controls
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.getAttribute('data-preset');
            applyPreset(presetName);
        });
    });

    // Custom Color Picker
    const customColorPicker = document.getElementById('customColorPicker');
    if (customColorPicker) {
        customColorPicker.addEventListener('input', (e) => {
            clearAnimation();
            presetButtons.forEach(btn => btn.classList.remove('active'));
            const hex = e.target.value;
            dots.forEach(dot => {
                dot.style.fill = hex;
                dot.style.filter = `drop-shadow(0 0 6px ${hex})`;
            });
        });
    }

    // Initialize with Warm White
    applyPreset('warm-white');


    // ---------------------------------------------
    // Multi-step Form Wizard (Quote Estimator)
    // ---------------------------------------------
    const wizardForm = document.getElementById('quoteEstimatorForm');
    if (wizardForm) {
        const steps = wizardForm.querySelectorAll('.wizard-step');
        const progressBar = document.getElementById('wizardProgress');
        const stepNumText = document.getElementById('stepNumber');
        const btnNext = document.getElementById('btnNext');
        const btnPrev = document.getElementById('btnPrev');
        
        let currentStepIdx = 0;
        
        // Form selections state variables
        let selectedLft = '';
        let selectedTrimColor = '';

        // Linear footage options selection
        const sizeOptions = wizardForm.querySelectorAll('.option-card');
        sizeOptions.forEach(card => {
            card.addEventListener('click', () => {
                sizeOptions.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedLft = card.getAttribute('data-value');
                document.getElementById('hiddenLftInput').value = selectedLft;
            });
        });

        // Trim color selection
        const trimSwatches = wizardForm.querySelectorAll('.color-swatch-item');
        trimSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                trimSwatches.forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                selectedTrimColor = swatch.getAttribute('data-value');
                document.getElementById('hiddenTrimInput').value = selectedTrimColor;
            });
        });

        function updateWizardUI() {
            // Toggle active step
            steps.forEach((step, idx) => {
                if (idx === currentStepIdx) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            // Update Progress Bar
            const percent = ((currentStepIdx + 1) / steps.length) * 100;
            progressBar.style.width = `${percent}%`;
            stepNumText.textContent = `${currentStepIdx + 1} of ${steps.length}`;

            // Adjust navigation buttons visibility/labels
            if (currentStepIdx === 0) {
                btnPrev.style.visibility = 'hidden';
            } else {
                btnPrev.style.visibility = 'visible';
            }

            if (currentStepIdx === steps.length - 1) {
                btnNext.textContent = 'Get Instant Quote';
                btnNext.classList.remove('btn-secondary');
                btnNext.classList.add('btn-primary');
            } else {
                btnNext.textContent = 'Continue';
                btnNext.classList.remove('btn-primary');
                btnNext.classList.add('btn-secondary');
            }
        }

        function validateStep() {
            if (currentStepIdx === 0) {
                // Step 1: Eaves Size
                if (!selectedLft) {
                    alert('Please select your home eave length to estimate.');
                    return false;
                }
                return true;
            } else if (currentStepIdx === 1) {
                // Step 2: Trim Color
                if (!selectedTrimColor) {
                    alert('Please select a color matching your roof trim.');
                    return false;
                }
                return true;
            } else if (currentStepIdx === 2) {
                // Step 3: Contact Information
                const name = document.getElementById('clientName').value.trim();
                const email = document.getElementById('clientEmail').value.trim();
                const phone = document.getElementById('clientPhone').value.trim();
                const address = document.getElementById('clientAddress').value.trim();

                if (!name || !email || !phone || !address) {
                    alert('Please complete all contact information fields.');
                    return false;
                }
                
                // Quick basic email validate
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return false;
                }
                
                return true;
            }
            return true;
        }

        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!validateStep()) {
                return;
            }

            if (currentStepIdx < steps.length - 1) {
                currentStepIdx++;
                updateWizardUI();
            } else {
                // Submit Form
                submitQuoteEstimator();
            }
        });

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentStepIdx > 0) {
                currentStepIdx--;
                updateWizardUI();
            }
        });

        function submitQuoteEstimator() {
            // Disable buttons and show loading state
            btnNext.disabled = true;
            btnPrev.disabled = true;
            btnNext.textContent = 'Calculating estimate...';

            const name = document.getElementById('clientName').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            
            // Gather input values
            console.log('Form Submission:', {
                eavesLength: selectedLft,
                trimColor: selectedTrimColor,
                name: name,
                email: email,
                phone: document.getElementById('clientPhone').value,
                address: document.getElementById('clientAddress').value
            });

            // Simulate server request delay
            setTimeout(() => {
                // Render Success State
                const wizardCard = document.querySelector('.wizard-card');
                
                // Estimate price roughly based on selected footage selection:
                // Small: $2,500 - $3,500
                // Medium: $3,500 - $5,500
                // Large: $5,500 - $8,000
                // X-Large: Custom
                let estimationRange = '';
                if (selectedLft === 'small') estimationRange = '$2,450 – $3,200';
                else if (selectedLft === 'medium') estimationRange = '$3,400 – $4,850';
                else if (selectedLft === 'large') estimationRange = '$4,900 – $6,800';
                else estimationRange = '$7,000+ (Requires On-Site Consultation)';

                wizardCard.innerHTML = `
                    <div class="success-state">
                        <div class="success-icon">
                            <svg stroke="currentColor" fill="none" stroke-width="2.5" viewBox="0 0 24 24" width="36" height="36">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3>Estimate Calculated!</h3>
                        <p class="step-desc">Thank you, <strong>${name}</strong>. We've sent a detailed proposal estimate to <strong>${email}</strong>.</p>
                        
                        <div style="background: rgba(255,126,0,0.06); border: 1px solid rgba(255,126,0,0.2); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: left;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                                <span>Trim Track Match:</span>
                                <span style="text-transform: capitalize; font-weight:600; color: #fff;">${selectedTrimColor}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.8rem; font-size: 0.9rem; color: var(--text-secondary);">
                                <span>Estimated Roofline:</span>
                                <span style="text-transform: capitalize; font-weight:600; color: #fff;">${selectedLft === 'xlarge' ? '300+ Linear Feet' : selectedLft}</span>
                            </div>
                            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 0.8rem 0;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:600; color: var(--text-primary);">Estimated System Cost:</span>
                                <span style="font-weight:800; font-size:1.25rem; color: var(--accent-color);">${estimationRange}</span>
                            </div>
                        </div>

                        <p style="font-size:0.85rem; color: var(--text-muted);">A permanent lighting designer will contact you shortly at your provided phone number to confirm eaves measurements using satellite modeling.</p>
                    </div>
                `;
            }, 1800);
        }

        // Initialize progress bar width
        updateWizardUI();
    }
});
