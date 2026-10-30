import { Reveal } from "@/components/motion/Reveal";
import { DeveloperMore } from "@/components/home/DeveloperMore";

export function Quality() {
  return (
    <section className="paper band" id="quality">
      <div className="sheet">
        <div className="quality-head">
          <div>
            <Reveal as="h2">
              <span className="quality-lead">Built to last.</span>
              <br />
              <span className="quality-accent">Finished with care.</span>
            </Reveal>
            <div className="title-arrows title-arrows--start" aria-hidden="true">
              <span className="pillar-arrow pillar-arrow--flip" />
              <span className="pillar-arrow" />
            </div>
          </div>
          <picture className="quality-landscape">
            <source
              srcSet="/assets/emerald-green-panoramic-landscape-outline.webp"
              type="image/webp"
            />
            <img
              src="/assets/Emerald%20Green%20Panoramic%20Landscape%20Outline.png"
              alt="Stylised green hillside landscape representing Madhavam at Raj Nagar Extension"
              width={2172}
              height={724}
            />
          </picture>
        </div>
        <Reveal as="p" className="lead-copy">
          Construction quality is the foundation of Madhavam — checked at each
          stage, from structure to the day a family takes the keys.
        </Reveal>
        <div className="pillar-grid">
          <Reveal as="article">
            <h3>Quality Construction</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Specified materials and a documented build process; structural work
              treated as the product, not a shortcut.
            </p>
            <img
              className="pillar-mark"
              src="/assets/Minimal%20Green%20Hills%20with%20Stylised%20Tree.png"
              alt=""
              width={1997}
              height={788}
            />
          </Reveal>
          <Reveal as="article">
            <h3>On-Time Delivery</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Schedules shared in plain language so buyers can plan possession
              without chasing updates.
            </p>
            <img
              className="pillar-mark"
              src="/assets/Minimal%20Green%20Hills%20with%20Stylised%20Tree.png"
              alt=""
              width={1997}
              height={788}
            />
          </Reveal>
          <Reveal as="article">
            <h3>
              Prime
              <br className="pillar-break" /> Location
            </h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              On Harnandipuram Access Road, Rajnagar Extension — connected to
              everyday Ghaziabad life.
            </p>
            <img
              className="pillar-mark"
              src="/assets/Minimal%20Green%20Hills%20with%20Stylised%20Tree.png"
              alt=""
              width={1997}
              height={788}
            />
          </Reveal>
          <Reveal as="article">
            <h3>Transparent Processes</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Pricing, paperwork, and possession explained up front. Earthwaves
              Developers Pvt Ltd, GSTIN on record.
            </p>
            <img
              className="pillar-mark"
              src="/assets/Minimal%20Green%20Hills%20with%20Stylised%20Tree.png"
              alt=""
              width={1997}
              height={788}
            />
          </Reveal>
        </div>

        <Reveal className="developer" id="about">
          <picture className="developer-bg">
            <source
              srcSet="/assets/elegant-banquet-hall-interior.webp"
              type="image/webp"
            />
            <img
              src="/assets/Elegant%20Banquet%20Hall%20Interior.png"
              alt="Club Madhavam multi-purpose hall interior by Earthwaves Developers"
            />
          </picture>
          <div className="developer-scrim" aria-hidden="true" />
          <div className="developer-mark" aria-hidden="true">
            <img
              src="/assets/krinajiavatargolder.webp"
              alt=""
              width={1268}
              height={1241}
            />
          </div>
          <div className="developer-copy">
            <p className="developer-kicker">About Developer</p>
            <h3>Building Trust. Shaping Futures.</h3>
            <DeveloperMore />
            <p className="developer-meta" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
