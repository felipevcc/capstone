# Recruitment system

Backend project at Coderise for a recruitment system between companies and students called **Holbie Talent Hub**.

## Setup

To configure the database server you must create the `.env` file where the necessary environment variables for the connection with the database will be. the file must have the following variables:
```
DB_HOST="localhost"
DB_PORT=3306
DB_USER="root"
DB_PASS="123"
DB_NAME="holbie_talent_hub"
```
The values of these variables depend on where and how the database is created, these were a few examples.

## Documentation

Documentation is implemented with Swagger in this path: `[host]/api/v1/documentation`.

## Authors
| [<img src="https://avatars.githubusercontent.com/u/114111326?v=4" width=85><br><sub> Juan Esteban Duque </sub>](https://github.com/Juanesduque1) | [<img src="https://avatars.githubusercontent.com/u/106930148?v=4" width=85><br><sub> Andres Rodriguez </sub>](https://github.com/Andres98100) | [<img src="https://avatars.githubusercontent.com/u/95534180?v=4" width=85><br><sub> Felipe Villamizar </sub>](https://github.com/felipevcc) | 
| :---: | :---: | :---: |

> This api is consumed by [holbie-talent-hub](https://github.com/Natha0b/holbie-talent-hub-client)
