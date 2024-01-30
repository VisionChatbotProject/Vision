import os

secret = {}
# with open('run/secrets/github_token', 'r') as file:
#     secret = file.read()

content = ''
with open('requirements.txt', 'r') as file:
    content = file.read()

# content = content.replace('${GITHUB_API_KEY}', secret)

with open('requirements.txt', 'w') as file:
    file.write(content)

print(content)