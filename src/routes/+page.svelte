<script lang="ts">
  import {
    Button,
    Input,
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui";
  import {
    Lock,
    Mail,
    Heart,
    Diamond,
    Leaf,
    Circle,
    Star,
    Camera,
    Lightbulb,
    CheckCircle,
    CircleCheck,
    Zap,
    Loader2
  } from "lucide-svelte";
  import { submitForm } from "$lib/services/formSubmission";

  let formData = {
    name: "",
    email: "",
    height: "",
    photos: [] as File[],
  };

  let photoPreviews: string[] = [];
  let isSubmitting = false;
  let submitMessage = "";
  let submitSuccess = false;

  function handlePhotoUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      Array.from(files).forEach((file) => {
        formData.photos = [...formData.photos, file];
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreviews = [...photoPreviews, e.target?.result as string];
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removePhoto(index: number) {
    formData.photos = formData.photos.filter((_, i) => i !== index);
    photoPreviews = photoPreviews.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    submitMessage = "";
    submitSuccess = false;
    
    try {
      const result = await submitForm(formData);
      
      if (result.success) {
        submitSuccess = true;
        submitMessage = result.message || `Obrigada! Sua solicitação de análise foi enviada com sucesso. ID: ${result.id}`;
        
        // Limpar formulário
        formData = {
          name: "",
          email: "",
          height: "",
          photos: [],
        };
        photoPreviews = [];
      } else {
        submitSuccess = false;
        submitMessage = `Erro ao enviar: ${result.error}`;
      }
    } catch (error) {
      submitSuccess = false;
      submitMessage = "Erro inesperado. Tente novamente.";
      console.error("Submit error:", error);
    } finally {
      isSubmitting = false;
    }
  }

  function scrollToForm() {
    const formSection = document.getElementById("analysis-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToKibbeFamilies() {
    const kibbeSection = document.querySelector("#kibbe-families");
    if (kibbeSection) {
      kibbeSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const kibbeTypes = [
    {
      category: "Dramáticos",
      types: ["Dramático", "Dramático Suave"],
      description:
        "Estrutura óssea marcante e angular com linhas verticais longas",
    },
    {
      category: "Naturais",
      types: ["Natural", "Natural Suave", "Natural Flamejante"],
      description: "Estrutura óssea ampla e atlética com bordas retas",
    },
    {
      category: "Clássicos",
      types: ["Clássico Dramático", "Clássico Suave"],
      description:
        "Características equilibradas e simétricas com proporções moderadas",
    },
    {
      category: "Gamines",
      types: ["Gamine Flamejante", "Gamine Suave"],
      description: "Petite com características angulares e linhas geométricas",
    },
    {
      category: "Românticos",
      types: ["Romântico", "Romântico Teatral"],
      description: "Linhas suaves e curvilíneas com estrutura óssea delicada",
    },
  ];
</script>

<svelte:head>
  <title
    >Análise do Tipo Corporal Kibbe - Descubra Sua Identidade de Estilo</title
  >
  <meta
    name="description"
    content="Descubra seu tipo corporal Kibbe através de análise profissional. Receba recomendações de estilo personalizadas baseadas na sua estrutura óssea única."
  />
</svelte:head>

<!-- Hero Section -->
<section
  class="relative min-h-screen flex items-center overflow-hidden"
  style="background: linear-gradient(135deg, #F6F1EC 0%, rgba(231, 200, 194, 0.3) 50%, #E7C8C2 100%);"
>
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-40">
    <div
      class="absolute top-0 left-0 w-full h-full"
      style="background: linear-gradient(135deg, rgba(231, 200, 194, 0.2) 0%, rgba(212, 175, 164, 0.2) 100%);"
    ></div>
    <div
      class="absolute top-10 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
      style="background-color: #E7C8C2;"
    ></div>
    <div
      class="absolute top-40 right-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
      style="background-color: #D4AFA4; animation-delay: 2s;"
    ></div>
    <div
      class="absolute bottom-20 left-20 w-36 h-36 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
      style="background-color: #B8968B; animation-delay: 4s;"
    ></div>
  </div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <!-- Content Side -->
      <div class="space-y-8 text-center lg:text-left">
        <div class="space-y-8">
          <!-- Main Headline -->
          <h1
            class="text-4xl md:text-6xl font-bold leading-tight text-gray-900"
          >
            Descubra Seu Tipo de Corpo e Escolha Roupas que
            <span
              class="bg-clip-text text-transparent"
              style="background: linear-gradient(90deg, #B8968B 0%, #D4AFA4 50%, #E7C8C2 100%); -webkit-background-clip: text;"
              >Realmente te Valorizam</span
            >
          </h1>

          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Análise personalizada e científica em algumas horas. Basta enviar
            suas fotos e receba por e-mail o seu Kibbe Body Type - o método que
            revolucionou a moda mundial.
          </p>

          <!-- Bullet Points -->
          <div
            class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                style="background-color: #B8968B;"
              ></div>
              <span class="text-gray-700 font-medium"
                >100% baseado em ciência</span
              >
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                style="background-color: #D4AFA4;"
              ></div>
              <span class="text-gray-700 font-medium">Para todos os corpos</span
              >
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                style="background-color: #E7C8C2;"
              ></div>
              <span class="text-gray-700 font-medium">Resultado rápido</span>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <button
            class="text-lg px-8 py-4 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg font-semibold"
            style="background: linear-gradient(90deg, #B8968B 0%, #D4AFA4 100%);"
            on:click={scrollToForm}
          >
            Quero descobrir meu tipo de corpo
          </button>
          <button
            class="text-lg px-6 py-4 border-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style="border-color: #D4AFA4; color: #B8968B; background-color: rgba(246, 241, 236, 0.5);"
            on:click={scrollToKibbeFamilies}
          >
            Conheça mais sobre o método
          </button>
        </div>

        <!-- Trust Elements -->
        <div class="grid md:grid-cols-3 gap-6 text-center lg:text-left">
          <div class="flex flex-col lg:flex-row items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              style="background-color: rgba(184, 150, 139, 0.1);"
            >
              <Lock class="w-5 h-5" style="color: #B8968B;" />
            </div>
            <span class="text-sm text-gray-600 font-medium"
              >Suas fotos são 100% seguras e privadas</span
            >
          </div>
          <div class="flex flex-col lg:flex-row items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              style="background-color: rgba(212, 175, 164, 0.1);"
            >
              <Mail class="w-5 h-5" style="color: #D4AFA4;" />
            </div>
            <span class="text-sm text-gray-600 font-medium"
              >Resultado direto no seu e-mail</span
            >
          </div>
          <div class="flex flex-col lg:flex-row items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              style="background-color: rgba(231, 200, 194, 0.1);"
            >
              <Heart class="w-5 h-5" style="color: #E7C8C2;" />
            </div>
            <span class="text-sm text-gray-600 font-medium"
              >Feito especialmente para mulheres</span
            >
          </div>
        </div>
      </div>

      <!-- Image Side -->
      <div class="relative flex justify-center lg:justify-end">
        <div class="relative">
          <!-- Main Image -->
          <div
            class="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/hero-section-image.jpg"
              alt="Mulher confiante descobrindo seu estilo Kibbe"
              class="w-full h-auto max-w-lg object-cover"
            />

            <!-- Floating badges -->
            <div
              class="absolute top-4 left-4 text-white rounded-xl p-3 shadow-lg"
              style="background: linear-gradient(135deg, rgba(184, 150, 139, 0.9) 0%, rgba(212, 175, 164, 0.9) 100%); backdrop-filter: blur(10px);"
            >
              <div class="text-xs font-medium">Análise Científica</div>
              <div class="text-sm font-bold">Kibbe Method</div>
            </div>

            <div
              class="absolute bottom-4 right-4 text-white rounded-xl p-3 shadow-lg"
              style="background: linear-gradient(135deg, rgba(212, 175, 164, 0.9) 0%, rgba(231, 200, 194, 0.9) 100%); backdrop-filter: blur(10px);"
            >
              <div class="text-xs font-medium">Resultados em</div>
              <div class="text-sm font-bold">24-48h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Kibbe Types Information Section -->
<section id="kibbe-families" class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <!-- Title -->
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">O Método Kibbe</h2>
    </div>

    <!-- Image and Text Section -->
    <div class="grid lg:grid-cols-2 gap-12 items-center mb-20">
      <!-- Image Side -->
      <div class="flex justify-center lg:justify-end">
        <img 
          src="/yin-yang-mandala.jpg" 
          alt="Yin Yang Mandala - Equilíbrio das energias" 
          class="w-80 h-80 object-cover rounded-full shadow-lg"
        />
      </div>

      <!-- Text Side -->
      <div class="space-y-6">
        <h3 class="text-3xl font-bold text-gray-900">Muito Além das 'Frutas'</h3>
        <p class="text-lg text-gray-600 leading-relaxed">
          Esqueça o "corpo maçã" ou "corpo pera". O método Kibbe analisa seu corpo de forma completa: estrutura óssea, como sua pele se distribui nos ossos e até suas características faciais. É um sistema baseado no equilíbrio yin-yang - energias que todos temos em proporções diferentes.
        </p>
      </div>
    </div>

    <!-- Kibbe Types Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      <!-- Row 1: 2 cards -->
      <div class="lg:col-start-1">
        <Card class="text-center hover:shadow-lg transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, rgba(231, 200, 194, 0.1) 0%, rgba(246, 241, 236, 0.1) 100%);">
          <CardContent class="p-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #E7C8C2 0%, #D4AFA4 100%);">
              <Diamond class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">Dramática</h4>
            <p class="text-gray-600">Linhas retas e elegantes</p>
          </CardContent>
        </Card>
      </div>

      <div class="lg:col-start-2">
        <Card class="text-center hover:shadow-lg transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, rgba(212, 175, 164, 0.1) 0%, rgba(231, 200, 194, 0.1) 100%);">
          <CardContent class="p-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #D4AFA4 0%, #B8968B 100%);">
              <Leaf class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">Natural</h4>
            <p class="text-gray-600">Estrutura forte e livre</p>
          </CardContent>
        </Card>
      </div>

      <!-- Row 2: 3 cards -->
      <div>
        <Card class="text-center hover:shadow-lg transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, rgba(184, 150, 139, 0.1) 0%, rgba(212, 175, 164, 0.1) 100%);">
          <CardContent class="p-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #B8968B 0%, #D4AFA4 100%);">
              <Circle class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">Clássica</h4>
            <p class="text-gray-600">Equilibrada e atemporal</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card class="text-center hover:shadow-lg transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, rgba(231, 200, 194, 0.1) 0%, rgba(184, 150, 139, 0.1) 100%);">
          <CardContent class="p-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #E7C8C2 0%, #B8968B 100%);">
              <Star class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">Gamine</h4>
            <p class="text-gray-600">Contrastes charmosos em corpo compacto</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card class="text-center hover:shadow-lg transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, rgba(212, 175, 164, 0.1) 0%, rgba(246, 241, 236, 0.1) 100%);">
          <CardContent class="p-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #D4AFA4 0%, #E7C8C2 100%);">
              <Heart class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">Romântica</h4>
            <p class="text-gray-600">Curvas suaves e delicadas</p>
          </CardContent>
        </Card>
      </div>

      <!-- CTA Card -->
      <div>
        <Card class="text-center hover:shadow-lg transition-all duration-300" style="background: linear-gradient(135deg, #B8968B 0%, #D4AFA4 50%, #E7C8C2 100%);">
          <CardContent class="p-8 flex flex-col justify-center h-full">
            <h4 class="text-xl font-bold text-white mb-4">Conheça o seu tipo de corpo</h4>
            <button 
              class="text-lg px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold cursor-pointer"
              on:click={scrollToForm}
            >
              Começar Minha Análise
            </button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- 3-Step Process Section -->
    <div class="bg-gray-50 rounded-3xl p-12">
      <div class="text-center mb-12">
        <h3 class="text-3xl font-bold text-gray-900 mb-4">Como Funciona Nosso Processo</h3>
        <p class="text-lg text-gray-600">Três etapas simples para descobrir seu tipo Kibbe</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Step 1 -->
        <div class="text-center relative">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #E7C8C2 0%, #D4AFA4 100%);">
            <Camera class="w-10 h-10 text-white" />
          </div>
          <div class="absolute top-10 -right-4 hidden md:block">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">1. Envio da Foto</h4>
          <p class="text-gray-600">Envie suas fotos seguindo nossas orientações simples</p>
        </div>

        <!-- Step 2 -->
        <div class="text-center relative">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #D4AFA4 0%, #B8968B 100%);">
            <Lightbulb class="w-10 h-10 text-white" />
          </div>
          <div class="absolute top-10 -right-4 hidden md:block">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">2. Análise por IA</h4>
          <p class="text-gray-600">Nossa IA especializada analisa suas características únicas</p>
        </div>

        <!-- Step 3 -->
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #B8968B 0%, #E7C8C2 100%);">
            <Mail class="w-10 h-10 text-white" />
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">3. Resultado</h4>
          <p class="text-gray-600">Receba seu tipo Kibbe e guia de estilo personalizado</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- Form Section -->
<section 
  id="analysis-form" 
  class="py-20 relative overflow-hidden"
  style="background: linear-gradient(135deg, #F6F1EC 0%, rgba(231, 200, 194, 0.3) 50%, #E7C8C2 100%);"
>
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-30">
    <div
      class="absolute top-0 left-0 w-full h-full"
      style="background: linear-gradient(135deg, rgba(231, 200, 194, 0.1) 0%, rgba(212, 175, 164, 0.1) 100%);"
    ></div>
    <div
      class="absolute top-10 right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
      style="background-color: #E7C8C2;"
    ></div>
    <div
      class="absolute bottom-20 left-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
      style="background-color: #D4AFA4; animation-delay: 2s;"
    ></div>
  </div>
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Faça Sua Análise Kibbe
        </h2>
        <p class="text-xl text-gray-600">
          Envie suas informações e foto para uma análise personalizada do tipo
          corporal Kibbe. Nossos especialistas vão fornecer recomendações
          detalhadas adequadas às suas características únicas.
        </p>
      </div>

      <Card class="shadow-xl bg-white">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Usaremos essas informações para fornecer a você a análise e
            recomendações mais precisas.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-gray-700"
              >Nome Completo</label
            >
            <Input
              id="name"
              placeholder="Digite seu nome completo"
              bind:value={formData.name}
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700"
              >Endereço de Email</label
            >
            <Input
              id="email"
              type="email"
              placeholder="Digite seu endereço de email"
              bind:value={formData.email}
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label for="height" class="text-sm font-medium text-gray-700"
              >Altura (em cm)</label
            >
            <Input
              id="height"
              type="number"
              placeholder="Ex: 165"
              bind:value={formData.height}
              class="w-full"
            />
          </div>

          <!-- Photo Recommendations Card -->
          <Card class="border-l-4" style="border-left-color: #D4AFA4; background: linear-gradient(135deg, rgba(231, 200, 194, 0.05) 0%, rgba(246, 241, 236, 0.05) 100%);">
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: rgba(212, 175, 164, 0.2);">
                  <Camera class="w-5 h-5" style="color: #D4AFA4;" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Recomendações para as Fotos</h4>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Para uma análise mais precisa, envie fotos com roupas de academia (top e shorts). Para resultados ainda mais assertivos, inclua também uma foto com roupa estruturada (linhas geométricas, tecido encorpado) e outra com roupa fluida (curvas suaves, tecidos macios e detalhes que realçam as formas naturais).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div class="space-y-2">
            <label for="photos" class="text-sm font-medium text-gray-700"
              >Upload das Fotos</label
            >
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
              {#if photoPreviews.length > 0}
                <div class="space-y-4">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {#each photoPreviews as preview, index}
                      <div class="relative group">
                        <img
                          src={preview}
                          alt="Preview {index + 1}"
                          class="w-full h-32 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          on:click={() => removePhoto(index)}
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    {/each}
                  </div>
                  <p class="text-sm text-gray-500">{photoPreviews.length} foto{photoPreviews.length > 1 ? 's' : ''} enviada{photoPreviews.length > 1 ? 's' : ''}</p>
                </div>
              {:else}
                <div class="space-y-4">
                  <div
                    class="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-600 font-medium">
                      Faça upload das suas fotos
                    </p>
                    <p class="text-sm text-gray-500">
                      Você pode enviar múltiplas fotos para uma análise mais completa
                    </p>
                  </div>
                </div>
              {/if}
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                on:change={handlePhotoUpload}
                class="hidden"
              />
              <Button
                variant="outline"
                class="mt-4"
                on:click={() => document.getElementById("photos")?.click()}
              >
                {photoPreviews.length > 0 ? 'Adicionar Mais Fotos' : 'Escolher Fotos'}
              </Button>
            </div>
          </div>

          <!-- Submit Message -->
          {#if submitMessage}
            <div class="p-4 rounded-lg {submitSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
              <p class="text-sm {submitSuccess ? 'text-green-800' : 'text-red-800'}">
                {submitMessage}
              </p>
            </div>
          {/if}

          <div class="pt-4">
            <Button
              class="w-full text-lg py-4"
              size="lg"
              on:click={handleSubmit}
              disabled={!formData.name || !formData.email || formData.photos.length === 0 || isSubmitting}
            >
              {#if isSubmitting}
                <Loader2 class="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              {:else}
                Enviar para Análise
              {/if}
            </Button>
          </div>

          <div class="text-xs text-gray-500 text-center">
            Ao enviar, você concorda com nossa política de privacidade. Sua foto
            e informações serão usadas exclusivamente para fins de análise
            Kibbe.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

