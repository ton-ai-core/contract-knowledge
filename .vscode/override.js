#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Display available Blueprint projects in the current directory.
 */
function showAvailableProjects() {
    console.log('\n📂 Available projects with their structure:');
    let found = false;

    try {
        const entries = fs.readdirSync(process.cwd());
        for (const entry of entries) {
            const fullPath = path.join(process.cwd(), entry);
            if (!fs.statSync(fullPath).isDirectory() || entry.startsWith('.')) {
                continue;
            }

            const hasConfig = fs.existsSync(path.join(fullPath, 'blueprint.config.ts'));
            const hasWrappersAndContracts =
                fs.existsSync(path.join(fullPath, 'wrappers')) &&
                fs.existsSync(path.join(fullPath, 'contracts'));

            if (!hasConfig && !hasWrappersAndContracts) {
                continue;
            }

            found = true;
            console.log(`\n   📁 ${entry}/`);

            ['contracts', 'scripts', 'tests', 'wrappers'].forEach(subDir => {
                const subPath = path.join(fullPath, subDir);
                if (!fs.existsSync(subPath)) return;

                const files = fs.readdirSync(subPath);
                if (files.length === 0) return;

                console.log(`      ├── ${subDir}/ (${files.length} files)`);
                files.slice(0, 3).forEach((filename, idx) => {
                    const isLastExample = idx === 2 || idx === files.length - 1;
                    const prefix = isLastExample ? '      │   └──' : '      │   ├──';
                    console.log(`${prefix} ${filename}`);
                });

                if (files.length > 3) {
                    console.log(`      │   └── ... and ${files.length - 3} more files`);
                }
            });
        }
    } catch {
        console.log('   (Failed to read directory)');
        return;
    }

    if (!found) {
        console.log('   (No Blueprint projects found)');
    }
}

function main() {
    // Intercept any blueprint command
    const args = process.argv.slice(2);
    console.log('⚡ Command intercepted: npx blueprint', args.join(' '));

    // Always block execution
    console.log('\n🚫 COMMAND BLOCKED');
    console.log('📍 You are not allowed to run any Blueprint commands here.');

    // Show instructions for creating a new project
    console.log('\n💡 To create a new project, use:');
    console.log('   # Tact contract:');
    console.log('     npx -y create ton-ai@latest MyProject -- --type tact-empty --contractName MyContract');
    console.log('     npx -y create ton-ai@latest MyProject -- --type tact-counter --contractName MyContract');
    console.log('\n   # FunC contract:');
    console.log('     npx -y create ton-ai@latest MyProject -- --type func-empty --contractName MyContract');
    console.log('     npx -y create ton-ai@latest MyProject -- --type func-counter --contractName MyContract');
    console.log('\n   # Tolk contract:');
    console.log('     npx -y create ton-ai@latest MyProject -- --type tolk-empty --contractName MyContract');
    console.log('     npx -y create ton-ai@latest MyProject -- --type tolk-counter --contractName MyContract');
    console.log('\n💡 Or navigate to an existing project:');
    console.log('     cd ProjectName');
    console.log('     npx blueprint <command>');

    // Display available projects
    showAvailableProjects();

    // Exit with error code
    process.exit(1);
}

main();
