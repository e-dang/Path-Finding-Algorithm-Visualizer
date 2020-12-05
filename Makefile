PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`
STATIC_DIR := $(PROJECT_DIR)/path_finding/static
ANSIBLE_DIR := $(PROJECT_DIR)/ansible
TERRAFORM_DIR := $(PROJECT_DIR)/terraform

install:
	python3 -m pip install -U pip
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	cd $(STATIC_DIR) && yarn install

build:
	cd $(STATIC_DIR) && yarn build

test-js:
	cd $(STATIC_DIR)/tests && yarn test

test-py:
	cd $(PROJECT_DIR) && pytest -m unit

test-unit: test-js test-py

test-ft:
	cd $(PROJECT_DIR) && pytest -m functional

test: test-unit test-ft


provision:
	cd $(TERRAFORM_DIR) && \
	terraform init && \
	terraform apply -auto-approve
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible create_user.yml --extra-vars "ansible_ssh_user=root" && \
	ansible-playbook -i inventory.ansible provision.yml --become

deploy-staging:
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible deploy.yml --limit staging --become

deploy-prod:
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible deploy.yml --limit prod --become