.PHONY: help install create_env build start deploy dev lint clean clean_cache up_next

help:
	@echo "📚 Available commands:"
	@echo "  - deps: Install bun and project dependencies"
	@echo "  - install: Install dependencies using bun"
	@echo "  - create_env: Create environment variables file to then fill out"
	@echo "  - build: Build the project"
	@echo "  - start: Start a production build of the project on specified port (default: 3000)"
	@echo "  - deploy: Runs a build and start command to deploy the project"
	@echo "  - dev: Start the development server on specified port (default: 3000)"
	@echo "  - lint: Run linting, this is run automatically before each commit"
	@echo "  - clean: Clean the project by removing node_modules and build directories"
	@echo "  - clean_cache: Clean the project and bun cache"
	@echo "  - up: Update frontend framework necessary dependencies"

install_bun:
	@echo "🚧 Installing bun..."
	npm install -g bun

install:
	@echo "🛠️ Installing..."
	bun install --save-text-lockfile

deps: install_bun install

create_env:
	@echo "🚚 Creating environment variables files .env",
	@cp .env.example .env

PORT ?= 3000

build:
	@echo "🏗️ Building..."
	bun build

start:
	@echo "🧜‍ Starting on port $(PORT)..."
	bun run start -p $(PORT)

deploy: build start

dev:
	@echo "🧑‍💻 Starting dev server on port $(PORT)..."
	bun run dev -p $(PORT)

lint:
	@echo "🧹 Linting..."
	bun lint

clean:
	@echo "🗑️ Cleaning..."
	rm -rf node_modules .astro dist

clean_cache: clean
	@echo "🗑️ Cleaning everything..."
	bun cache clear --all

up:
	@echo "🧑‍🚀 Updating astro..."
	bunx @astrojs/upgrade

up_biome:
	@echo "🆙 Updating biome..."
	bun update @biomejs/biome --latest
	bunx @biomejs/biome migrate --write
