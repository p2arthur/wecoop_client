import Footer from '../components/Footer'
import { ellipseAddress } from '../utils/ellipseAddress'

const Whitepaper = () => (
  <div className="my-8 w-full px-4">
    <h1 className="text-4xl font-bold mb-4">WeCoop v1.0 Whitepaper</h1>

    <div className="text-lg leading-7 text-gray-700">
      <p>
        <strong>Abstract:</strong> WeCoop v1.0 is an innovative social media platform built on the Algorand blockchain, leveraging
        Algorand's speed, efficiency, and low transaction costs to provide a seamless and permissionless social media experience. Users can
        connect with their Algorand wallets, including Pera Wallet, Defly, and Daffi Wallet, enabling frictionless transactions and
        interactions. This whitepaper outlines the core features, principles, and economic model of WeCoop v1.0.
      </p>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">1. Introduction:</h2>
        <p>
          WeCoop v1.0 serves as an experimental proof of concept, showcasing the capabilities of the Algorand blockchain in the realm of
          social media. With a fixed supply of 21 million{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>
          s, WeCoop aims to deliver a decentralized and user-centric platform that fosters genuine interactions. The platform's design
          ensures fast, secure, and cost-effective transactions, paving the way for a new era of social media on the Algorand blockchain.
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
          Fixed Supply:{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>{' '}
          maintains a fixed supply of 21 million, promoting scarcity and value retention. Distribution: Fully distributed, ensures fair and
          equitable distribution among users. Anti-Rugpull:{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>{' '}
          is resistant to rug pulls, providing users with a secure and trustworthy digital asset on the Algorand blockchain.
        </p>
      </section>
      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">3. Platform Mechanics:</h2>
        <p>
          User Interaction: Users can create posts, like, and reply to content, with each interaction incurring a 0.1 $COOP fee. Wallet
          Integration: WeCoop v1.0 seamlessly integrates with Algorand wallets, including Pera Wallet, Defly, and Daffi Wallet, enhancing
          user accessibility. Transaction Notes: All posts and interactions are permanently recorded on the Algorand blockchain through
          transaction notes made to the platform wallet.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">4. Economic Model:</h2>
        <p>
          Sustainability: Transaction fees play a vital role in sustaining the WeCoop ecosystem. The 0.1 $COOP fee ensures a balance between
          incentivizing user engagement and maintaining the platform's financial health. Wealth Distribution: Allocation of fees to both
          content creators and the platform wallet promotes a fair and transparent wealth distribution model.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2 break-words">5. Platform Wallet:</h2>
        <p>
          The platform wallet{' '}
          <a
            className="underline text-blue-700"
            href="https://algoexplorer.io/address/DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM"
          >
            {ellipseAddress('DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM')}
          </a>{' '}
          acts as the repository for transaction fees generated on the platform. Transparency and accountability are maintained to build
          trust within the community.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-2xl font-bold mb-2">6. Platform Power:</h2>
        <p>
          WeCoop v1.0 is powered by{' '}
          <a className="text-blue-700 underline" href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=796425061">
            CoopCoin
          </a>{' '}
          ($COOP), a community coin we believe is exemplary. Our choice reflects our commitment to fostering a robust and engaging social
          media experience within the Algorand ecosystem.
        </p>
      </section>

      <p className="mt-4">
        <strong>Conclusion:</strong> WeCoop v1.0 stands at the intersection of blockchain technology and social media, providing a
        decentralized and efficient platform powered by Algorand. As a proof of concept, WeCoop showcases the integration of blockchain into
        mainstream social media, demonstrating the viability and potential of the Algorand blockchain for creating innovative solutions.
        Join us in building the future of decentralized social interactions with WeCoop v1.0.
      </p>
    </div>
    <Footer />
  </div>
)

export default Whitepaper
