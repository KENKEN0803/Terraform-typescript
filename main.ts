import {Construct} from "constructs";
import {App, TerraformStack} from "cdktf";
import {DockerProvider} from "@cdktf/provider-docker/lib/provider";
import {Image} from "@cdktf/provider-docker/lib/image";
import {Container} from "@cdktf/provider-docker/lib/container";

// CDKTF 스택을 생성합니다.
class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        // TerraformStack을 생성합니다.
        super(scope, name);

        // Docker Provider를 생성합니다.
        new DockerProvider(this, "docker", {});

        // Docker Image를 생성합니다.
        const dockerImage = new Image(this, "nginxImage", {
            name: "nginx:latest", // Docker Image 이름을 지정합니다.
            keepLocally: false, // Docker Image를 로컬에 저장할지 여부를 지정합니다.
        });

        // Docker Container를 생성합니다.
        new Container(this, "nginxContainer", {
            name: "tutorial", // Docker Container 이름을 지정합니다.
            image: dockerImage.name, // Docker Image 이름을 지정합니다.
            ports: [ // Docker Container 포트를 지정합니다.
                {
                    internal: 80,
                    external: 8000,
                },
            ],
        });
    }
}

// CDKTF 애플리케이션을 생성합니다.
const app = new App();
// CDKTF 스택을 생성합니다.
new MyStack(app, "learn-cdktf-docker");
// CDKTF 구성을 생성합니다.
app.synth();

/** 위의 CDKTF 코드는 다음 HCL 구성과 동일합니다.
 * resource "docker_image" "nginx" {
 *   name         = "nginx:latest"
 *   keep_locally = false
 * }
 *
 * resource "docker_container" "nginx" {
 *   image = docker_image.nginx.name
 *   name  = "tutorial"
 *   ports {
 *     internal = 80
 *     external = 8000
 *   }
 * }
 */
