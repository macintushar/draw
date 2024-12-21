## Self Hosting Draw

### Instructions

- Clone the repository

```bash
git clone https://github.com/macintushar/draw.git
cd draw
```

- Rename the file .env.example to .env and update the environment variables.

```bash
mv .env.example .env
```

- Start Draw using docker-compose

```bash
docker-compose up -d
```

- Open the UI in your browser at http://localhost:3729

- To stop the docker-compose, run the following command

```bash
docker-compose down
```

- To upgrade Draw, run the following command

```bash
docker-compose pull && docker-compose up -d
```

### Troubleshooting

If you encounter any issues, please raise an issue on the GitHub repository.
