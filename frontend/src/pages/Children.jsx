import { useEffect, useState } from "react";
import API from "../services/api";

export default function Children() {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const loadChildren = async () => {
    const { data } = await API.get("/children");

    setChildren(data.children);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const addChild = async () => {
    await API.post("/children", {
      name,
      age,
      gender: "male",
    });

    loadChildren();
  };

  return (
    <div className="p-10">

      <div className="flex gap-3 mb-8">

        <input
          className="border p-3 rounded-xl"
          placeholder="Child Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-3 rounded-xl"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          onClick={addChild}
          className="bg-green-500 text-white px-6 rounded-xl"
        >
          Add
        </button>

      </div>

      {children.map((child) => (
        <div
          key={child._id}
          className="bg-white p-5 rounded-xl shadow mb-3"
        >
          👦 {child.name} ({child.age})
        </div>
      ))}

    </div>
  );
}