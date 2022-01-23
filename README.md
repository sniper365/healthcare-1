##### HealthCare
### Decentralized application for managing Health Medical Records

### Motivation
<!--  -->

### Tech stack

As a result of the diploma assignment, a Web 3.0 application was developed. An Ethereum Smart Contract was written in
Solidity. Additionally, A React Web application was implemented in order to provide nice user interface and experience
for interacting with the Smart Contract.
The React application is powered by TypeScript and Redux.
Material UI is used to provide beatiful styling for the components.

### Project structure

_**/contracts**_ - place for all the Solidity Smart Contracts

_**/migrations**_ - the migrations scripts of the blockchain

_**/public**_ - publicly served files like index.html

_**/src**_ - React application
 - _**/assets**_ - place for all the static files (i18n labels, images, etc)
 - _**/components**_ - all the reusable components - the building blocks for the application
 - _**/contracts**_ - compiled abis for the smart contracts 
 - _**/hooks**_ - custom hooks and hook abstractions
 - _**/lib**_ - types and utility functions
 - _**/state**_ - Redux related interfaces like store, slices, reducers, etc
 - _**/views**_ - the view components, which represent whole pages

_**/test**_ - Smart contract unit tests


