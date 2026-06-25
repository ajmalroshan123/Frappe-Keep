
'use strict';

export const Tooltip = function ($element) {
    const $tooltip = document.createElement('span');
    $tooltip.classList.add('tooltip', 'text-body-small');

    $element.addEventListener('mouseenter', function () {
        $tooltip.textContent = this.dataset.tooltip;
        document.body.appendChild($tooltip);

        const {
            top,
            left,
            height,
            width
        } = this.getBoundingClientRect();

        // Measure tooltip dimensions after appending
        const tipRect = $tooltip.getBoundingClientRect();
        const margin = 8;

        // Default: below element, centred
        let tipTop = top + height + 4;
        let tipLeft = left + (width / 2) - (tipRect.width / 2);

        // Clamp horizontal: don't go off left or right edge
        tipLeft = Math.max(margin, Math.min(tipLeft, window.innerWidth - tipRect.width - margin));

        // If tooltip would go below the viewport, show above the element instead
        if (tipTop + tipRect.height > window.innerHeight - margin) {
            tipTop = top - tipRect.height - 6;
        }

        $tooltip.style.top = tipTop + 'px';
        $tooltip.style.left = tipLeft + 'px';
        $tooltip.style.transform = 'none';

        $element.addEventListener('mouseleave', $tooltip.remove.bind($tooltip), { once: true });
    });
};