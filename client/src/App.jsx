import { useState, useEffect, useMemo } from "react";
import {
  useMetamask,
  useAddress,
  useNetwork,
  useEditionDrop,
  useToken,
  useVote,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { AddressZero } from "@ethersproject/constants";

const REACT_APP_THIRDWEB_EDITION_DROP_ADDRESS =
  process.env.REACT_APP_THIRDWEB_EDITION_DROP_ADDRESS;
const REACT_APP_THIRDWEB_TOKEN_ADDRESS =
  process.env.REACT_APP_THIRDWEB_TOKEN_ADDRESS;
const REACT_APP_THIRDWEB_VOTE_ADDRESS =
  process.env.REACT_APP_THIRDWEB_VOTE_ADDRESS;

const shortenAddress = (address) => {
  return (
    address.substring(0, 8) + "..." + address.substring(address.length - 3)
  );
};

const App = () => {
  const [isMember, setIsMember] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [memberBalances, setMemberBalances] = useState([]);
  const members = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberBalances?.find(({ holder }) => holder === address);
      return {
        address,
        balance: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberBalances]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const address = useAddress();
  const network = useNetwork();
  const connectMetamask = useMetamask();
  const editionDrop = useEditionDrop(REACT_APP_THIRDWEB_EDITION_DROP_ADDRESS);
  const token = useToken(REACT_APP_THIRDWEB_TOKEN_ADDRESS);
  const vote = useVote(REACT_APP_THIRDWEB_VOTE_ADDRESS);

  useEffect(() => {
    if (address) {
      checkMembership();
    }
  }, [address]);

  useEffect(() => {
    if (isMember) {
      accessDAO();
    }
  }, [isMember]);

  useEffect(() => {
    if (proposals.length > 0) {
      checkVotes();
    }
  }, [proposals]);

  const checkMembership = async () => {
    try {
      const balance = await editionDrop.balanceOf(address, 0);
      if (balance.gt(0)) {
        setIsMember(true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    setIsMember(false);
  };

  const accessDAO = async () => {
    try {
      const addresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(addresses);
      const balances = await token.history.getAllHolderBalances();
      setMemberBalances(balances);
      const proposals = await vote.getAll();
      setProposals(proposals);
    } catch (error) {
      console.error(error);
    }
  };

  const checkVotes = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[0].proposalId);
      setHasVoted(hasVoted);
    } catch (error) {
      console.error(error);
    }
  };

  const mint = async () => {
    try {
      setIsMinting(true);
      await editionDrop.claim("0", 1);
      alert(
        `OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
      isMember(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMinting(false);
    }
  };

  if (!address) {
    return (
      <div className="landing">
        <h1>YeDAO</h1>
        <h3>the DAO for Kanye West memes</h3>
        <button className="btn-hero" onClick={connectMetamask}>
          connect wallet
        </button>
      </div>
    );
  }

  if (network[0]?.data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="landing">
        <h1>YeDAO</h1>
        <h3>the DAO for Kanye West memes</h3>
        <p>switch to rinkeby</p>
      </div>
    );
  }

  if (isMember) {
    return (
      <div className="member-page">
        <h1>YeDAO</h1>
        <h3>the DAO for Kanye West memes</h3>
        <div style={{ justifyContent: "center" }}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/emxXa2thgv8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <div>
            <h2>members</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>address</th>
                  <th>balance</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => {
                  return (
                    <tr key={i}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>proposals</h2>
            {
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsVoting(true);
                  const votes = proposals.map((proposal) => {
                    let result = {
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const element = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      );
                      if (element.checked) {
                        result.vote = vote.type;
                        return;
                      }
                    });
                    return result;
                  });
                  try {
                    const delegation = await token.getDelegationOf(address);
                    if (delegation === AddressZero) {
                      await token.delegateTo(address);
                    }
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          const proposal = await vote.get(proposalId);
                          if (proposal.state === 1) {
                            return vote.vote(proposalId, _vote);
                          }
                          return;
                        })
                      );
                      try {
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            const proposal = await vote.get(proposalId);
                            if (proposal.state === 4) {
                              return vote.execute(proposalId);
                            }
                          })
                        );
                        setHasVoted(true);
                      } catch (error) {
                        console.error(error);
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal, i) => (
                  <div key={i} className="card">
                    <h3>{proposal.description}</h3>
                    <div>
                      {proposal.votes.map(({ label, type }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={isVoting || hasVoted}>
                  {isVoting ? "voting..." : hasVoted ? "already voted" : "vote"}
                </button>
                {!hasVoted && (
                  <div style={{ textAlign: "center" }}>
                    <p>
                      this will trigger multiple transactions that you will need
                      to sign
                    </p>
                  </div>
                )}
              </form>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>YeDAO</h1>
      <h3>the DAO for Kanye West memes</h3>
      <p>mint a YeDAO membership NFT</p>
      <button onClick={mint} disabled={isMinting}>
        {isMinting ? "minting..." : "mint"}
      </button>
    </div>
  );
};

export default App;
