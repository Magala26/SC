import Layout from '@/components/Layout';
import '../offer.css';
import rotationSneakerUrl from '@/assets/rotation-sneaker.png';
import { subscriptionOfferImages } from '@/data/sneakercareImages';

export default function Offer() {
  const subscriptionPoster = subscriptionOfferImages[0];

  return (
    <Layout>
      <section className="rrp-offer-page" id="rotation-refresh-plan">
        <section className="rrp-hero">
          <div className="rrp-hero__copy">
            <span className="rrp-eyebrow">Premium Sneaker Care Membership</span>

            <p className="rrp-offer-name">The Rotation Refresh Plan</p>

            <h1>
              Keep every pair in your rotation looking box-fresh — every month.
            </h1>

            <p className="rrp-lead">
              Stop letting dirty sneakers kill the look, value, and confidence of your collection.
              Get monthly professional sneaker care built for collectors, resellers, athletes,
              and serious sneaker lovers who refuse to let their rotation fall off.
            </p>

            <div className="rrp-hero__actions">
              <a className="rrp-btn rrp-btn--primary" href="#rrp-plans">
                Lock In My Monthly Plan
              </a>
              <a className="rrp-btn rrp-btn--secondary" href="https://wa.me/27665884466">
                Ask On WhatsApp
              </a>
            </div>

            <div className="rrp-proof-row" aria-label="Offer highlights">
              <div>
                <strong>Month-to-month</strong>
                <span>No long contract</span>
              </div>
              <div>
                <strong>From R1499</strong>
                <span>Built for real rotations</span>
              </div>
              <div>
                <strong>Bonus included</strong>
                <span>Free gift on sign-up</span>
              </div>
            </div>
          </div>

          <div className="rrp-hero__visual" aria-label="Sneaker care subscription product visual">
            <div 
              className="rrp-product-stage"
              style={{
                backgroundImage: `url('${subscriptionOfferImages[1]?.src || rotationSneakerUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="rrp-product-glow"></div>

              <div className="rrp-floating-card rrp-floating-card--top">
                <span>Starter Plan</span>
                <strong>R1499</strong>
                <small>10 pairs monthly</small>
              </div>

              <div className="rrp-floating-card rrp-floating-card--bottom">
                <span>Collector Plan</span>
                <strong>R3499</strong>
                <small>30 pairs + restorations</small>
              </div>
            </div>
          </div>
        </section>

        <section className="rrp-problem-strip">
          <div>
            <span>01</span>
            <strong>Your rotation gets worn fast.</strong>
            <p>
              Daily wear, dust, creases, stains, and yellowing build up before you notice it.
            </p>
          </div>

          <div>
            <span>02</span>
            <strong>Dirty pairs lose their impact.</strong>
            <p>
              A strong outfit falls flat when the sneakers look tired, neglected, or unkept.
            </p>
          </div>

          <div>
            <span>03</span>
            <strong>Monthly care keeps you ready.</strong>
            <p>
              Your kicks stay ready to wear, shoot, sell, flex, or store with confidence.
            </p>
          </div>
        </section>

        <section className="rrp-plans" id="rrp-plans">
          <div className="rrp-section-heading">
            <span className="rrp-eyebrow">Choose Your Care Level</span>
            <h2>Two plans for serious sneaker owners.</h2>
            <p>
              Whether you have a weekly rotation or a full sneaker vault, this offer turns sneaker care
              into a simple monthly system.
            </p>
          </div>

          <div className="rrp-plan-grid">
            <article className="rrp-plan-card">
              <div className="rrp-plan-card__header">
                <span className="rrp-plan-tag">Best for weekly wearers</span>
                <h3>Rotation Refresh 10</h3>
                <p>
                  Keep your everyday rotation clean, protected, and ready without booking from scratch.
                </p>
              </div>

              <div className="rrp-price">
                <span>R</span>
                <strong>1499</strong>
                <small>/ month</small>
              </div>

              <ul className="rrp-feature-list">
                <li>10 sneaker pairs included monthly</li>
                <li>Professional cleaning and care</li>
                <li>Month-to-month flexibility</li>
                <li>Free Case Beast iPhone cover with sign-up</li>
              </ul>

              <a
                className="rrp-btn rrp-btn--primary rrp-btn--full"
                href="https://wa.me/27665884466?text=Hi%20Sneaker%20Care%20Department%2C%20I%20want%20to%20lock%20in%20the%20Rotation%20Refresh%2010%20plan%20for%20R1499%20per%20month."
              >
                Lock In Rotation Refresh 10
              </a>
            </article>

            <article className="rrp-plan-card rrp-plan-card--featured">
              <div className="rrp-featured-label">Most Complete</div>

              <div className="rrp-plan-card__header">
                <span className="rrp-plan-tag rrp-plan-tag--red">Best for collectors</span>
                <h3>Vault Refresh 30+</h3>
                <p>
                  Built for collectors, resellers, and high-volume sneaker owners who need cleaning,
                  repairs, and restoration support.
                </p>
              </div>

              <div className="rrp-price">
                <span>R</span>
                <strong>3499</strong>
                <small>/ month</small>
              </div>

              <ul className="rrp-feature-list">
                <li>30 sneaker pairs included monthly</li>
                <li>5 repairs or restorations included</li>
                <li>Premium care for higher-value collections</li>
                <li>Free Hypebricks Kit with sign-up</li>
              </ul>

              <a
                className="rrp-btn rrp-btn--dark rrp-btn--full"
                href="https://wa.me/27665884466?text=Hi%20Sneaker%20Care%20Department%2C%20I%20want%20to%20lock%20in%20the%20Vault%20Refresh%2030%2B%20plan%20for%20R3499%20per%20month."
              >
                Lock In Vault Refresh 30+
              </a>
            </article>
          </div>
        </section>

        <section className="rrp-bonus-panel">
          <div className="rrp-bonus-panel__copy">
            <span className="rrp-eyebrow rrp-eyebrow--light">Sign-Up Bonus</span>
            <h2>Join now and get more than just clean sneakers.</h2>
            <p>
              Each plan includes a sign-up bonus designed to make the subscription feel like a complete
              sneaker-care package instead of a once-off cleaning service.
            </p>
          </div>

          {subscriptionPoster && (
            <div className="rrp-offer-poster">
              <img src={subscriptionPoster.src} alt={subscriptionPoster.alt} loading="lazy" />
            </div>
          )}

          <div className="rrp-bonus-grid">
            <div className="rrp-bonus-card">
              <strong>Rotation Refresh 10</strong>
              <span>Free Case Beast iPhone Cover</span>
            </div>

            <div className="rrp-bonus-card rrp-bonus-card--red">
              <strong>Vault Refresh 30+</strong>
              <span>Free Hypebricks Kit</span>
            </div>
          </div>
        </section>

        <section className="rrp-how-it-works">
          <div className="rrp-section-heading rrp-section-heading--left">
            <span className="rrp-eyebrow">How It Works</span>
            <h2>Your monthly sneaker-care system.</h2>
            <p>
              The goal is simple: choose your plan once, then keep your sneaker rotation consistently clean.
            </p>
          </div>

          <div className="rrp-steps-grid">
            <article>
              <span>1</span>
              <h3>Choose your plan</h3>
              <p>Select the monthly care level that matches the size of your sneaker rotation.</p>
            </article>

            <article>
              <span>2</span>
              <h3>Confirm on WhatsApp</h3>
              <p>Tap the button and confirm your plan, timing, and collection details with the team.</p>
            </article>

            <article>
              <span>3</span>
              <h3>Send in your pairs</h3>
              <p>Your sneakers receive professional cleaning, care, and restoration where included.</p>
            </article>

            <article>
              <span>4</span>
              <h3>Stay rotation-ready</h3>
              <p>Repeat monthly and keep your collection looking clean, valuable, and ready to flex.</p>
            </article>
          </div>
        </section>

        <section className="rrp-final-cta">
          <span className="rrp-eyebrow rrp-eyebrow--light">Ready To Refresh Your Kicks?</span>
          <h2>Do not wait until your best pairs look cooked.</h2>
          <p>
            Lock in your monthly sneaker-care plan now and keep your rotation looking like it belongs in the box.
          </p>
          <a className="rrp-btn rrp-btn--light" href="https://wa.me/27665884466">
            Subscribe On WhatsApp
          </a>
        </section>
      </section>
    </Layout>
  );
}
