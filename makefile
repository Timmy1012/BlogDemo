# Since I tend to forget most of the commands, I use a makefile to keep track of them.

background ?= false


help: ## Show this help message
# Copied from https://gist.github.com/prwhite/8168133?permalink_comment_id=3456785#gistcomment-3456785
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

start-backend: ## Start the backend server
	cd backend && python3 manage.py runserver $(if $(background), &,)

start-frontend: ## Start the frontend server
	cd frontend && npm start $(if $(background), &,)

start: ## Start the project (backend and frontend), use make kill to stop
	$(MAKE) start-backend background=true
	# Wait for backend to start
	sleep 2
	$(MAKE) start-frontend background=true

kill: ## Stop the project
	# Kill backend server
	fuser -k 8000/tcp || true
	# Kill frontend server
	fuser -k 3000/tcp || true