import React from "react";
import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0
  }
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selected, setSelected] = useState({});
  function handleUpdateBalance(newBalance) {
    setFriends(
      friends.map((friend) =>
        friend === selected
          ? { ...friend, balance: friend.balance + newBalance }
          : friend
      )
    );
    const temp = selected;
    setSelected({});
    // setSelected(temp);
  }
  return (
    <div className="app">
      <Sidebar
        friends={friends}
        setFriends={setFriends}
        selected={selected}
        setSelected={setSelected}
      />
      {Object.keys(selected).length !== 0 && (
        <SplitBillWith selected={selected} updateBalance={handleUpdateBalance}>
          Split a bill with {selected.name}
        </SplitBillWith>
      )}
    </div>
  );
}
function Sidebar({ friends, setFriends, selected, setSelected }) {
  const [addFriend, setFriend] = useState(false);
  function handleAddFriend(friendName, imageURL) {
    const id = crypto.randomUUID();
    const entry = {
      id: id,
      name: friendName,
      image: `${imageURL}?u=${id}`,
      balance: 0
    };
    setFriends([...friends, entry]);
  }
  function toggle() {
    setFriend(!addFriend);
  }
  function handleSelectedChange(friendObject) {
    setSelected(friendObject);
    setFriend(false);
  }
  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <Friend
            friendObject={friend}
            selected={selected}
            onSelectedChange={handleSelectedChange}
          />
        ))}
      </ul>
      {!addFriend ? (
        <Button handleClick={toggle}>Add Friend</Button>
      ) : (
        <>
          <AddFriend onAddFriend={handleAddFriend} />
          <Button handleClick={toggle}>Close</Button>
        </>
      )}
    </div>
  );
}
function Friend({ friendObject, selected, onSelectedChange }) {
  const current = selected.id === friendObject.id;
  return (
    <li className={`${current ? "selected" : ""}`}>
      <img src={friendObject.image} alt={friendObject.name} />
      <h3>{friendObject.name}</h3>
      {friendObject.balance === 0 ? (
        <p>{`You and ${friendObject.name} are even`}</p>
      ) : friendObject.balance > 0 ? (
        <p className="green">{`${friendObject.name} owes you ${friendObject.balance}€`}</p>
      ) : (
        <p className="red">{`You owe ${friendObject.name} ${
          friendObject.balance * -1
        }€`}</p>
      )}
      <button
        className="button"
        onClick={() => onSelectedChange(current ? {} : friendObject)}
      >
        {current ? "Close" : "Select"}
      </button>
    </li>
  );
}
function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48");
  function preventDefault(e) {
    e.preventDefault();
  }
  function handleNewFriend() {
    onAddFriend(name, imageURL);
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => preventDefault(e)}>
      <Input val={name} onChangeValue={setName}>
        <span>🧑‍🧑</span>Friend Name
      </Input>
      <Input val={imageURL} onChangeValue={setImageURL}>
        <span>🌄</span>Image URL
      </Input>
      <button
        className="button"
        onClick={(e) => (name !== "" ? handleNewFriend(name, imageURL) : null)}
      >
        Add
      </button>
      {/* <Button onClick = {(e) => name !== "" ? onAddFriend(name, imageURL) : null}>Add</Button> */}
    </form>
  );
}
function Input({ children, val, onChangeValue }) {
  return (
    <React.Fragment className="input">
      <label className="label">{children}</label>
      <input value={val} onChange={(e) => onChangeValue(e.target.value)} />
    </React.Fragment>
  );
}
function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

function SplitBillWith({ children, selected, updateBalance }) {
  const [bill, setBill] = useState();
  const [myBill, setMyBill] = useState(null);
  const [payer, setPayer] = useState("you");
  function preventDefault(e) {
    e.preventDefault();
  }
  function splitAndReset() {
    if (payer === "you") {
      const supp = bill - myBill;
      updateBalance(supp);
    } else {
      const supp = myBill * -1;
      updateBalance(supp);
    }
    // below are not executed ig
  }
  function handleMyBill(newValue) {
    if (Number(newValue) > bill) {
      setMyBill(myBill);
    } else {
      setMyBill(newValue);
    }
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={(e) => preventDefault(e)}>
        <h2>{children}</h2>
        <Input val={bill} onChangeValue={setBill}>
          <span>💰</span>Bill Value
        </Input>
        <Input val={myBill} onChangeValue={handleMyBill}>
          <span>👧</span>Your expense
        </Input>
        {/* <Input val = {bill - myBill} ><span >🧑‍🧑</span>{selected.name}'s expense</Input> */}
        <label className="label">
          <span>🧑‍🧑</span>
          {selected.name}'s expense
        </label>
        <input value={bill - myBill} disabled="disabled" />
        <Select selectedName={selected.name} payer={payer} setPayer={setPayer}>
          <span>🤑</span>Who is paying the bill
        </Select>
        <button className="button" onClick={() => splitAndReset()}>
          Split bill
        </button>
      </form>
    </>
  );
}

function Select({ children, selectedName, payer, setPayer }) {
  return (
    <React.Fragment className="select">
      <label>{children}</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{selectedName}</option>
      </select>
    </React.Fragment>
  );
}
