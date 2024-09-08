import Footer from '../components/Footer'
import { ellipseAddress } from '../utils/ellipseAddress'

const Whitepaper = () => (
  <div className="w-full px-4 flex flex-col py-20 dark:bg-gray-950 bg-gray-100">
    <h1 className="text-4xl font-bold mb-4 text-center">WeCoop Beta Whitepaper</h1>
    <p className="text-center italic text-gray-500 mb-8">Developed by iam_p2 and Felipe — Proud Brazilian Developers</p>

    <div className="text-lg leading-7 text-gray-700 max-w-4xl mx-auto">
      <p className="mb-6">
        <strong>Abstract:</strong> WeCoop Beta is an innovative, decentralized, and permissionless social media platform, proudly built by
        Brazilian developers iam_p2 and Felipe. Designed to support users facing political blockages on social networks in Brazil, WeCoop
        offers a free, open space for expression. Leveraging the Algorand blockchain’s speed, efficiency, and low transaction costs, WeCoop
        enables seamless social interactions and transactions. With wallet integrations such as Pera Wallet, Defly, and Daffi Wallet, users
        experience smooth access and engagement. This whitepaper outlines the core features, guiding principles, and economic model behind
        WeCoop Beta, along with our vision for its future.
      </p>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">1. Introduction:</h2>
        <p>
          WeCoop Beta is a groundbreaking proof of concept, demonstrating the power of Algorand's blockchain in the social media space.
          Created by two passionate Brazilian developers committed to freedom of expression, WeCoop offers a new platform for users who have
          experienced censorship or social media restrictions due to political issues in Brazil. With a fixed supply of 21 million{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoins
          </a>
          , WeCoop delivers a decentralized, user-centric experience that facilitates fast, secure, and affordable transactions. We aim to
          set a new standard for social media platforms, particularly in environments where open dialogue is needed most.
        </p>
        <p className="mt-4">
          As a decentralized and permissionless platform, WeCoop empowers users to interact freely, ensuring that no centralized entity
          controls their ability to communicate.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">
          2.{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>{' '}
          ($COOP):
        </h2>
        <p>
          Fixed Supply: CoopCoin’s fixed supply of 21 million fosters scarcity and long-term value retention. Distribution: CoopCoin is
          fairly distributed among users, ensuring a democratic and inclusive system. Anti-Rugpull: Designed to prevent rug pulls, CoopCoin
          provides a secure and trustworthy digital asset within the Algorand blockchain ecosystem.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">3. Platform Mechanics:</h2>
        <p>
          User Interaction: Users can create posts, likes, and replies, each interaction incurring a 0.1 $COOP fee, ensuring a vibrant and
          engaging community. Wallet Integration: WeCoop integrates seamlessly with Algorand wallets such as Pera Wallet, Defly, and Daffi
          Wallet, providing frictionless access for users. Transaction Notes: All posts and interactions are permanently recorded on the
          Algorand blockchain through transaction notes, ensuring transparency and immutability.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">4. Economic Model:</h2>
        <p>
          Sustainability: The 0.1 $COOP transaction fee strikes a balance between promoting user engagement and ensuring the platform's
          sustainability over the long term. Wealth Distribution: Fees are allocated between content creators and the platform wallet,
          promoting a fair and transparent wealth distribution model that rewards active participation.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">5. Platform Wallet:</h2>
        <p>
          The platform wallet{' '}
          <a
            className="underline text-blue-700"
            href="https://algoexplorer.io/address/DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM"
          >
            {ellipseAddress('DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM')}
          </a>{' '}
          serves as the repository for transaction fees collected on the platform. Transparency and accountability are foundational to
          building trust within the community.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">6. Platform Power:</h2>
        <p>
          WeCoop Beta is powered by{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>{' '}
          ($COOP), the cornerstone of our decentralized social media ecosystem. As a community-driven coin, CoopCoin represents our
          commitment to creating a dynamic, censorship-resistant platform that thrives within the Algorand blockchain. We are focused on
          growing the WeCoop platform, introducing new features to support and boost communities—initially within the Algorand ecosystem—
          while fostering real-world impact through decentralized solutions.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">Future Plans:</h2>
        <p>
          As WeCoop continues to evolve, some features planned for the full v1.0 release include the addition of other coins like $ALGO and
          $xUSD for cross-community interactions, enhanced layout and bugfixes, an MVP for communities that allows creators and followers to
          benefit from the economy within WeCoop, better analytics, and a fee restructure that ensures economic viability for both
          developers and users.
        </p>
        <p className="mt-4">
          WeCoop is not just about social interaction; it is about building bridges between diverse communities and giving individuals the
          power to express themselves openly, without fear of censorship. Created by two young developers with a passion for building
          innovative solutions, WeCoop is designed to make the world a better place by championing freedom of expression through
          decentralized technology.
        </p>
      </section>

      <p className="mt-6">
        <strong>Conclusion:</strong> WeCoop Beta represents more than just a new social media platform—it is a statement of freedom,
        designed by proud Brazilian developers iam_p2 and Felipe. With its decentralized, permissionless infrastructure, WeCoop provides a
        secure, open space for individuals to express themselves without centralized control. By integrating Algorand’s cutting-edge
        blockchain technology, WeCoop sets the stage for the future of social media, where censorship is no longer a barrier. Join us in
        shaping the future of decentralized social networks, and be part of a movement that brings people together from all over the world
        through WeCoop.
      </p>
    </div>
    <Footer />
  </div>
)

export default Whitepaper
