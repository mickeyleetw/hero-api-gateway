## Installation for Hero API GateWay

1. Clone hero-api-gateway repository

   ```shell
   $ git clone https://github.com/mickeyleetw/hero-api-gateway.git
   ```
2. Install project dependencies

   ```shell
   $ cd hero-api-gateway
   $ npm install
   ```

## Run service

    ```shell
    $ npm run start  
    ```
    the above commands will boot the server on `http://localhosl:8000`

    Following Log will  shown if server successfully start
    
    ```
        This server is running on port 8000
    ```
    The default response in root path will return the following response

    ```text
    "Hello,World"
    ```


## Run Test
    ```shell
    $ npm run test 
    ```


## Repository Structure
![image](https://github.com/mickeyleetw/hero-api-gateway/blob/main/structure.drawio.svg)

1. apps.js
> Express server on

2. routers 
> Server router repo,with api view function

3. repositories
> router send request to repository layer,repository may follow each api view function usecase to integrate request from adapter layer

4. adapters
> external API server

5. Models
> restrict each entity model interface in order to conduct error-free data flow
