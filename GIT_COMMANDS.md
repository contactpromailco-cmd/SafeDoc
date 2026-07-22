# 📝 Quick Git Commands Reference

## 🎯 Push to GitHub (First Time)

```bash
# Navigate to project
cd "c:\Users\Surface\Desktop\business\doc tool"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/safedoc.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔄 Regular Updates (After First Push)

```bash
# See what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your change description"

# Push to GitHub
git push
```

---

## 🚀 One-Line Commands

### Quick commit and push:
```bash
git add . ; git commit -m "Update" ; git push
```

### See commit history:
```bash
git log --oneline
```

### Check remote URL:
```bash
git remote -v
```

### See changes before committing:
```bash
git diff
```

---

## 🆘 Undo Mistakes

### Undo last commit (keep changes):
```bash
git reset --soft HEAD~1
```

### Discard all local changes:
```bash
git reset --hard HEAD
```

### Remove file from staging:
```bash
git reset HEAD filename
```

---

## 🌿 Branches

### Create new branch:
```bash
git checkout -b feature-name
```

### Switch branches:
```bash
git checkout main
```

### Push new branch:
```bash
git push -u origin feature-name
```

### Merge branch:
```bash
git checkout main
git merge feature-name
```

---

## 📦 First Time Setup

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Check config
git config --list
```

---

## 🔐 GitHub Authentication

If asked for password:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it `repo` access
4. Copy the token
5. Use it as your password

Or install GitHub CLI:
```bash
gh auth login
```

---

## ✅ Current Status

Your repository:
- ✅ Initialized
- ✅ First commit done
- ✅ Ready to push to GitHub

Run this to push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/safedoc.git
git push -u origin main
```

---

## 📚 Full Guide

See **GITHUB_SETUP.md** for detailed instructions!
