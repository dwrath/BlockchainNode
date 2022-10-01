import React from "react";

function ViewBalance() {
  return (
    <div>
      <section id="viewAccountBalance">
        <h1>View Account Balance</h1>
        Address:{" "}
        <input
          type="text"
          id="textBoxAccountAddress"
          class="address"
          value="f3a1e69b6176052fcc4a3248f1c5a91dea308ca9"
        />
        <input type="button" id="buttonDisplayBalance" value="Display Balance" />
        <textarea id="textareaAccountBalanceResult" class="result" readonly="true"></textarea>
      </section>
    </div>
  );
}

export default ViewBalance;
