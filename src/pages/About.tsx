import { FaDiscord, FaTwitter } from 'react-icons/fa'
import Footer from '../components/Footer'

const Whitepaper = () => (
  <div className="w-full px-4 flex flex-col py-20 dark:bg-gray-950 bg-gray-100">
    <h1 className="text-4xl font-bold mb-4 text-center">WeCoop v1.0 Whitepaper</h1>
    <p className="text-center italic text-gray-500 mb-8">Developed by iam_p2 / Felipe / D2dods — Proud Brazilian Developers</p>

    <div className="text-lg leading-7 text-gray-700 max-w-4xl mx-auto">
      <p className="mb-6">
        <strong>Abstract:</strong> WeCoop v1.0 is an innovative, decentralized, and permissionless social media platform, proudly built by
        Brazilian developers iam_p2 and Felipe. This release introduces exciting features, from expanded coin support to enhanced analytics.
        Designed to offer an open space for free expression, particularly for users facing political restrictions, WeCoop leverages the
        Algorand blockchain’s speed and low costs to enable seamless social interactions. With support for $xUSD, $JAWS, $NIKO, $AKTA,
        $A200, $TINY, and $ORA, WeCoop aims to unite the $ALGO communities. This whitepaper highlights the core features and the economic
        model driving the platform.
      </p>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
        <p>
          WeCoop v1.0 marks the beginning of an exciting experiment in decentralized social media, offering a safe space for users who have
          experienced censorship. Created by two Brazilian developers passionate about freedom of expression, WeCoop provides a user-centric
          experience powered by Algorand's blockchain technology. With a mission to bring together diverse communities, particularly within
          the $ALGO ecosystem, WeCoop delivers fast, secure, and affordable social interactions.
        </p>
        <p className="mt-4">
          WeCoop is just the start, and we plan to take it to the next level. If you’re interested in helping us grow, don’t hesitate to
          reach out. You can also support us by donating to <strong>wecoopapp.algo</strong>.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">2. Expanded Coin Support and Coin-Specific Feeds</h2>
        <p>
          WeCoop v1.0 now supports seven coins: $xUSD, $JAWS, $NIKO, $AKTA, $A200, $TINY, and $ORA. Each coin has its own dedicated feed,
          allowing for a more engaged and connected community within each ecosystem.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">3. Platform Analytics and Explore Features</h2>
        <p>
          We've introduced powerful analytics to help users discover top creators and posts, improving the overall user experience and
          promoting visibility for quality content.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">4. Sharable URLs and Performance Improvements</h2>
        <p>
          All platform URLs are now shareable, making it easier to spread content across the web. We've also made performance improvements
          and bug fixes to provide a smoother experience. In addition, we've added a custom logo and animated loading screens to enhance the
          platform's design.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">5. Economic Model and Fee Structure</h2>
        <p>WeCoop operates on a straightforward fee structure:</p>
        <ul>
          <li>
            <strong>Posts:</strong> 2x multiplier
          </li>
          <li>
            <strong>Replies:</strong> 1.5x multiplier
          </li>
          <li>
            <strong>Likes:</strong> 1x multiplier
          </li>
        </ul>
        <p>
          The base fee for interactions is $0.03. 100% of post fees go to the platform, while 70% of interaction fees are paid directly to
          content creators, ensuring fair compensation for their contributions.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">6. Future Vision: Bringing Communities Together</h2>
        <p>
          As WeCoop evolves, we will continue adding features that empower diverse communities. Starting with the Algorand ecosystem, our
          goal is to create a platform that unites various blockchain ecosystems under one roof.
        </p>
        <p className="mt-4">
          WeCoop is more than just a social platform—it’s a movement for decentralized freedom of expression. We aim to build bridges across
          communities and foster open communication without censorship.
        </p>
      </section>

      <p className="mt-6">
        <strong>Conclusion:</strong> WeCoop v1.0 is a milestone in decentralized social media, empowering users to express themselves freely
        without fear of censorship. Developed by iam_p2 and Felipe, WeCoop leverages Algorand’s blockchain to build a platform where
        censorship is no longer a barrier. Join us in shaping the future of decentralized networks. If you'd like to support our mission,
        consider donating to <strong>wecoopapp.algo</strong> or reach out to help us grow.
      </p>
      <a className="text-blue-500 underline" href="https://www.linkedin.com/in/diego-cardoso-marques/">
        Special thanks to d2dods who helped
      </a>
    </div>

    <div className="flex justify-center mt-8 space-x-4">
      <a href="https://discord.gg/ZmaYMzwg" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
        <FaDiscord size={30} />
      </a>
      <a href="https://x.com/appwecoop" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
        <FaTwitter size={30} />
      </a>
    </div>

    <Footer />
  </div>
)

export default Whitepaper
