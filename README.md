# Portfolio

Live website: [https://portfolio.thestone.co.za/](https://portfolio.thestone.co.za/)

GitHub Pages publishes `main` from the repository root. Keep `CNAME` set to
`portfolio.thestone.co.za`, with a DNS CNAME record for `portfolio` pointing to
`xalebxen99.github.io`. Enable **Enforce HTTPS** in the repository's Pages settings
once DNS resolves and GitHub has issued the certificate.

On screens up to 900px wide, the About Me portrait is centered above the text with a responsive 3:4 frame. Larger screens retain the side-by-side layout.

Project iframes and media load only when their carousel slide is visible on screen.
Hidden videos are paused, and the carousel does not autoplay off screen or in a
background tab. Chart.js loads only when the My Progress slide is opened. The
pixel font loads without blocking the initial render.

Brondon's Revenge shows a local game screenshot until the visitor clicks
or keyboard-activates **Click to play**. Neither scrolling nor carousel autoplay
loads the game. Starting the game pauses carousel autoplay so it does not interrupt
play. Its Wits-hosted iframe URL includes `?muted=1` to start background music and
sound effects muted; the standalone game link does not.

Study Room uses `https://study.thestone.co.za/` and its source is
[study_room](https://github.com/XalebXEn99/study_room). Its iframe requires valid
HTTPS: after GitHub Pages completes DNS verification and issues the custom-domain
certificate, enable **Enforce HTTPS** in that repository's Pages settings.
The old GitHub Pages project URL redirects to the custom domain, so it cannot
bypass an invalid certificate. Do not switch the iframe to HTTP or disable
certificate verification.
