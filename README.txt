I have decided that as a database I'll continue working on the given JSON
I added a few fields to keep myself orginized
to the traders I added another object called "ownedShares" that holds all the shares that trader holds on the format of {<shareID> : <shareAmountOwned>}
I also added a third list in the JSON that holds all open requests in the following format:
{'id':<request id>,
'owner':<trader id of whoever made the request>,
'type': <b for buying/s for selling>,
'share': <share id>,
'amount':<amount of shares to buy or sell>,
'price':<asking price>}