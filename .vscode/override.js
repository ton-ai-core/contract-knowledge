#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if we're in the root directory of the project
function isInRootDirectory() {
    const currentDir = process.cwd();
    const rootDir = path.resolve(__dirname, '..');
    
    // Check if current directory matches the root directory
    return currentDir === rootDir;
}

// Function to check if we're in a project directory (with blueprint.config.ts)
function isInBlueprintProject() {
    const currentDir = process.cwd();
    const blueprintConfigExists = fs.existsSync(path.join(currentDir, 'blueprint.config.ts'));
    const wrappersDirExists = fs.existsSync(path.join(currentDir, 'wrappers'));
    const contractsDirExists = fs.existsSync(path.join(currentDir, 'contracts'));
    
    return blueprintConfigExists || (wrappersDirExists && contractsDirExists);
}

// Function to show project structure
function showProjectStructure(projectPath, projectName) {
    console.log(`   📁 ${projectName}/`);
    
    const subDirs = ['contracts', 'scripts', 'tests', 'wrappers'];
    
    subDirs.forEach(subDir => {
        const dirPath = path.join(projectPath, subDir);
        if (fs.existsSync(dirPath)) {
            try {
                const files = fs.readdirSync(dirPath);
                if (files.length > 0) {
                    console.log(`      ├── ${subDir}/ (${files.length} files)`);
                    // Show first few files as examples
                    const examples = files.slice(0, 3);
                    examples.forEach((file, index) => {
                        const isLast = index === examples.length - 1 && files.length <= 3;
                        const prefix = isLast ? '      │   └──' : '      │   ├──';
                        console.log(`${prefix} ${file}`);
                    });
                    if (files.length > 3) {
                        console.log(`      │   └── ... and ${files.length - 3} more files`);
                    }
                }
            } catch (err) {
                console.log(`      ├── ${subDir}/ (access denied)`);
            }
        }
    });
    console.log('');
}

// Main function
function main() {
    const startTime = Date.now();
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    console.log('⚡ Command intercepted: npx blueprint', args.join(' '));
    
    // BLOCKING: check if we're in the root directory
    if (isInRootDirectory()) {
        console.log('\n🚫 COMMAND BLOCKED');
        console.log('📍 You are in the root directory of the project.');
        console.log('\n💡 To create a new project use:');
        console.log('   # Tact contract:');
        console.log('   npx create ton-ai@latest MyProject -- --type tact-empty --contractName MyContract');
        console.log('   npx create ton-ai@latest MyProject -- --type tact-counter --contractName MyContract');
        console.log('');
        console.log('   # FunC contract:');
        console.log('   npx create ton-ai@latest MyProject -- --type func-empty --contractName MyContract');
        console.log('   npx create ton-ai@latest MyProject -- --type func-counter --contractName MyContract');
        console.log('');
        console.log('   # Tolk contract:');
        console.log('   npx create ton-ai@latest MyProject -- --type tolk-empty --contractName MyContract');
        console.log('   npx create ton-ai@latest MyProject -- --type tolk-counter --contractName MyContract');
        console.log('\n💡 Or navigate to an existing project:');
        console.log('   cd ProjectName');
        console.log('   npx blueprint <command>');
        console.log('\n📂 Available projects with their structure:');
        
        // Show available projects with structure
        try {
            const items = fs.readdirSync(process.cwd());
            const projectDirs = items.filter(item => {
                const itemPath = path.join(process.cwd(), item);
                const isDir = fs.statSync(itemPath).isDirectory();
                const hasBlueprint = fs.existsSync(path.join(itemPath, 'blueprint.config.ts')) ||
                                   (fs.existsSync(path.join(itemPath, 'wrappers')) && 
                                    fs.existsSync(path.join(itemPath, 'contracts')));
                return isDir && hasBlueprint && !item.startsWith('.');
            });
            
            if (projectDirs.length > 0) {
                console.log('');
                projectDirs.forEach(dir => {
                    const projectPath = path.join(process.cwd(), dir);
                    showProjectStructure(projectPath, dir);
                });
            } else {
                console.log('   (no Blueprint projects found)');
            }
        } catch (err) {
            console.log('   (failed to read directory)');
        }
        
        process.exit(1);
    }
    
    // Check if we're in a valid project directory
    if (!isInBlueprintProject()) {
        console.log('\n⚠️  WARNING');
        console.log('📍 Blueprint configuration not found in current directory.');
        console.log('💡 Make sure you are in a Blueprint project directory.');
    }
    
    // Path to the original blueprint
    const originalBlueprintPath = path.resolve(__dirname, '../node_modules/@ton-ai-core/blueprint/dist/cli/cli.js');
    
    // Check if original blueprint exists
    if (!fs.existsSync(originalBlueprintPath)) {
        console.error('❌ Original blueprint not found at path:', originalBlueprintPath);
        console.log('💡 Attempting to find blueprint globally...');
        
        // Try to run original blueprint globally
        const child = spawn('npx', ['@ton-ai-core/blueprint', ...args], {
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            const duration = Date.now() - startTime;
            console.log(`⏱️  Execution time: ${duration}ms`);
            process.exit(code);
        });

        child.on('error', (err) => {
            console.error('❌ Error running blueprint:', err.message);
            process.exit(1);
        });
    } else {
        console.log('🚀 Running blueprint...');
        
        // Run original blueprint
        const child = spawn('node', [originalBlueprintPath, ...args], {
            stdio: 'inherit'
        });

        child.on('close', (code) => {
            const duration = Date.now() - startTime;
            console.log(`⏱️  Execution time: ${duration}ms`);
            process.exit(code);
        });

        child.on('error', (err) => {
            console.error('❌ Error running blueprint:', err.message);
            process.exit(1);
        });
    }
}

// Exception handling
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught exception:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled promise rejection:', reason);
    process.exit(1);
});

// Run
main(); 