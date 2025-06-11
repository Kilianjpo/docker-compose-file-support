import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { formatDocument } from './formatter';

interface DockerComposeDocument {
    version?: string;
    services?: Record<string, unknown>;
    [key: string]: unknown; // Allow other properties
}

export function activate(context: vscode.ExtensionContext) {
    // Register document formatter
    const dockerComposeSelector: vscode.DocumentSelector = {
        language: 'dockercompose',
        scheme: 'file'
    };
    
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(dockerComposeSelector, {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                const formatted = formatDocument(document);
                const range = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                return [vscode.TextEdit.replace(range, formatted)];
            }
        })
    );
}

function validateDockerCompose(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    
    try {
        const composeObject = yaml.load(text) as DockerComposeDocument;
        
        if (composeObject && typeof composeObject === 'object') {
            // Now TypeScript knows composeObject might have a version property
            if (!composeObject.version) {
                const range = new vscode.Range(0, 0, 0, 0);
                diagnostics.push(new vscode.Diagnostic(
                    range,
                    "Docker Compose files should specify a version",
                    vscode.DiagnosticSeverity.Warning
                ));
            }
            
            // Add more validation rules as needed
        }
    } catch (e: unknown) {
		// Handle YAML parsing errors
		if (e instanceof Error) {
			// Check if it's a YAML error with mark information
			if (typeof e === 'object' && e !== null && 'mark' in e) {
				const yamlError = e as { mark: { position: number }, message: string };
				const pos = document.positionAt(yamlError.mark.position);
				const range = new vscode.Range(pos, pos);
				diagnostics.push(new vscode.Diagnostic(
					range,
					yamlError.message,
					vscode.DiagnosticSeverity.Error
				));
			} else {
				// Generic error handling
				const range = new vscode.Range(0, 0, 0, 0);
				diagnostics.push(new vscode.Diagnostic(
					range,
					e.message,
					vscode.DiagnosticSeverity.Error
				));
			}
		} else {
			// Fallback for completely unknown errors
			const range = new vscode.Range(0, 0, 0, 0);
			diagnostics.push(new vscode.Diagnostic(
				range,
				"Unknown error while parsing Docker Compose file",
				vscode.DiagnosticSeverity.Error
			));
        }
    }
    
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('dockercompose');
    diagnosticCollection.set(document.uri, diagnostics);
}