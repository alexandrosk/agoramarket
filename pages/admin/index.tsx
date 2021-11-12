import { create } from "ipfs-http-client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useData } from "../../contexts/DataContext";

const Admin = () => {
  const router = useRouter();
  const { polymarket, loadWeb3, account } = useData!();
  const [loading, setLoading] = React.useState(false);
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageHash, setImageHash] = React.useState("");
  const [resolverUrl, setResolverUrl] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<
    string | number | readonly string[] | undefined
  >(Date());

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const added = await client.add(file);
    setImageHash(added.path);
  };

  useEffect(() => {
    loadWeb3();
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    console.log("timestamp :>> ", timestamp);
    await polymarket.methods
      .createQuestion(title, imageHash, description, resolverUrl, timestamp)
      .send({
        from: account,
      });
    setLoading(false);
    setTitle("");
    setDescription("");
    setImageHash("");
    setResolverUrl("");
    setTimestamp(undefined);
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full p-5">
        <Head>
          <title>Polymarket</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="w-full flex flex-col py-4 max-w-5xl pb-6">
          <Link href="/admin/markets">
            <a className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white font-bold mb-5">
              See All Markets
            </a>
          </Link>
          <div className="w-full flex flex-col pt-1 border border-gray-300 p-5 rounded-lg ">
            <span className="text-lg font-semibold mt-4">Add New Market</span>
            <span className="text-lg font mt-6 mb-1">Market Title</span>
            <input
              type="input"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Title"
              autoComplete="off"
            />
            <span className="text-lg font mt-6 mb-1">Market Description</span>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Description"
              autoComplete="off"
            ></textarea>
            <span className="text-lg font mt-6 mb-1">Market Title Image</span>
            <input type="file" onChange={uploadImage} />
            <span className="text-lg font mt-6 mb-1">Resolve URL</span>
            <input
              type="input"
              name="resolverUrl"
              value={resolverUrl}
              onChange={(e) => setResolverUrl(e.target.value)}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="URL"
              autoComplete="off"
            />
            <span className="text-lg font mt-6 mb-1">End Date</span>
            <input
              type="date"
              name="timestamp"
              // value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.valueAsDate?.getTime());
              }}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              autoComplete="off"
            />
            {loading ? (
              <span className="text-center pt-5 pb-3 text-xl font-bold">
                Loading...
              </span>
            ) : (
              <button
                className="mt-5 rounded-lg py-3 text-center w-full bg-green-500 text-white font-bold"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Create Market
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
